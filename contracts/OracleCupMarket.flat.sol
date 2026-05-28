// Sources flattened with hardhat v2.28.6 https://hardhat.org

// SPDX-License-Identifier: MIT

// File contracts/OracleCupMarket.sol

// Original license: SPDX_License_Identifier: MIT
pragma solidity ^0.8.24;

/// @title  OracleCupMarket — AI-Oracle prediction markets for the FIFA World Cup
/// @notice Binary YES/NO markets settled by an AI Agent.
///         Native OKB on X Layer (chain 196). No tokens, no custody.
/// @author OracleCup (Build X Hackathon 2026)
contract OracleCupMarket {
    /* ------------------------------------------------------------ */
    /*                            STORAGE                            */
    /* ------------------------------------------------------------ */

    address public owner;     // deployer
    address public oracle;    // AI Agent — can create & settle markets
    address public charity;   // optional — receives 1% of every settled pool
    uint16  public constant CHARITY_BPS = 100; // 1.00 %

    enum Outcome { Unset, Yes, No, Cancelled }

    struct Market {
        string  question;       // human readable, e.g. "Brazil beats Argentina in group stage?"
        uint64  closeTime;      // betting closes (typically match kickoff)
        uint64  aiYesOddsBps;   // AI fair odds for YES in basis points (6700 = 67%)
        uint128 yesPool;
        uint128 noPool;
        Outcome outcome;
        bool    exists;
    }

    uint256 public nextMarketId;
    mapping(uint256 => Market) public markets;
    mapping(uint256 => mapping(address => uint128)) public yesBets;
    mapping(uint256 => mapping(address => uint128)) public noBets;
    mapping(uint256 => mapping(address => bool))    public claimed;

    /* ------------------------------------------------------------ */
    /*                             EVENTS                            */
    /* ------------------------------------------------------------ */
    event MarketCreated(uint256 indexed id, string question, uint64 closeTime, uint64 aiYesOddsBps);
    event BetPlaced   (uint256 indexed id, address indexed user, bool isYes, uint128 amount);
    event MarketSettled(uint256 indexed id, Outcome outcome);
    event Claimed     (uint256 indexed id, address indexed user, uint256 payout);
    event OracleChanged(address newOracle);
    event CharityChanged(address newCharity);

    /* ------------------------------------------------------------ */
    /*                           MODIFIERS                           */
    /* ------------------------------------------------------------ */
    modifier onlyOwner()  { require(msg.sender == owner, "not owner"); _; }
    modifier onlyOracle() { require(msg.sender == oracle || msg.sender == owner, "not oracle"); _; }

    /* ------------------------------------------------------------ */
    /*                          CONSTRUCTOR                          */
    /* ------------------------------------------------------------ */
    constructor(address _oracle, address _charity) {
        require(_oracle != address(0), "oracle = 0");
        owner   = msg.sender;
        oracle  = _oracle;
        charity = _charity; // can be 0x0
    }

    /* ------------------------------------------------------------ */
    /*                            ADMIN                              */
    /* ------------------------------------------------------------ */
    function setOracle(address a)  external onlyOwner { require(a != address(0), "0"); oracle = a; emit OracleChanged(a); }
    function setCharity(address a) external onlyOwner { charity = a; emit CharityChanged(a); }

    /* ------------------------------------------------------------ */
    /*                         CORE FUNCTIONS                        */
    /* ------------------------------------------------------------ */

    /// @notice AI Oracle creates a new market.
    function createMarket(string calldata question, uint64 closeTime, uint64 aiYesOddsBps)
        external onlyOracle returns (uint256 id)
    {
        require(closeTime > block.timestamp, "close in past");
        require(aiYesOddsBps <= 10000, "bad odds");
        id = nextMarketId++;
        markets[id] = Market({
            question: question,
            closeTime: closeTime,
            aiYesOddsBps: aiYesOddsBps,
            yesPool: 0,
            noPool: 0,
            outcome: Outcome.Unset,
            exists: true
        });
        emit MarketCreated(id, question, closeTime, aiYesOddsBps);
    }

    /// @notice Place a bet on YES or NO. Send OKB as msg.value.
    function bet(uint256 id, bool isYes) external payable {
        Market storage m = markets[id];
        require(m.exists, "no market");
        require(block.timestamp < m.closeTime, "closed");
        require(msg.value > 0, "no value");
        require(msg.value < type(uint128).max, "too big");

        if (isYes) {
            m.yesPool += uint128(msg.value);
            yesBets[id][msg.sender] += uint128(msg.value);
        } else {
            m.noPool += uint128(msg.value);
            noBets[id][msg.sender] += uint128(msg.value);
        }
        emit BetPlaced(id, msg.sender, isYes, uint128(msg.value));
    }

    /// @notice AI Oracle settles the market after kickoff/result.
    function settle(uint256 id, Outcome outcome) external onlyOracle {
        Market storage m = markets[id];
        require(m.exists, "no market");
        require(m.outcome == Outcome.Unset, "settled");
        require(outcome != Outcome.Unset, "bad outcome");
        require(block.timestamp >= m.closeTime, "not yet closed");

        // auto-cancel if winning side has zero stake -> refunds everyone
        if (outcome == Outcome.Yes && m.yesPool == 0) outcome = Outcome.Cancelled;
        if (outcome == Outcome.No  && m.noPool  == 0) outcome = Outcome.Cancelled;

        m.outcome = outcome;

        // 1% charity fee, taken from LOSING pool only (capped so we never underflow)
        if (outcome == Outcome.Yes || outcome == Outcome.No) {
            uint256 _pool = uint256(m.yesPool) + uint256(m.noPool);
            uint256 cut = (_pool * CHARITY_BPS) / 10000;
            uint256 losingPool = outcome == Outcome.Yes ? uint256(m.noPool) : uint256(m.yesPool);
            if (cut > losingPool) cut = losingPool; // cap — protects extreme one-sided markets
            if (charity != address(0) && cut > 0) {
                if (outcome == Outcome.Yes) {
                    m.noPool = uint128(uint256(m.noPool) - cut);
                } else {
                    m.yesPool = uint128(uint256(m.yesPool) - cut);
                }
                (bool ok, ) = charity.call{value: cut}("");
                require(ok, "charity transfer");
            }
        }
        emit MarketSettled(id, outcome);
    }

    /// @notice Winners (or all bettors if cancelled) call this once to receive payout.
    function claim(uint256 id) external {
        Market storage m = markets[id];
        require(m.outcome != Outcome.Unset, "not settled");
        require(!claimed[id][msg.sender], "claimed");

        uint256 payout;
        if (m.outcome == Outcome.Cancelled) {
            payout = uint256(yesBets[id][msg.sender]) + uint256(noBets[id][msg.sender]);
        } else if (m.outcome == Outcome.Yes) {
            uint256 stake = yesBets[id][msg.sender];
            require(stake > 0, "no win");
            uint256 _pool = uint256(m.yesPool) + uint256(m.noPool);
            payout = (_pool * stake) / uint256(m.yesPool);
        } else { // No
            uint256 stake = noBets[id][msg.sender];
            require(stake > 0, "no win");
            uint256 _pool = uint256(m.yesPool) + uint256(m.noPool);
            payout = (_pool * stake) / uint256(m.noPool);
        }
        require(payout > 0, "zero");
        claimed[id][msg.sender] = true;

        (bool ok, ) = msg.sender.call{value: payout}("");
        require(ok, "send failed");
        emit Claimed(id, msg.sender, payout);
    }

    /* ------------------------------------------------------------ */
    /*                          VIEW HELPERS                         */
    /* ------------------------------------------------------------ */

    /// @notice Frontend can fetch markets in a single call.
    function listMarkets(uint256 start, uint256 count) external view returns (Market[] memory out) {
        uint256 end = start + count;
        if (end > nextMarketId) end = nextMarketId;
        if (start > end) start = end;
        out = new Market[](end - start);
        for (uint256 i = start; i < end; i++) {
            out[i - start] = markets[i];
        }
    }

    function getUserStake(uint256 id, address user) external view returns (uint128 yes_, uint128 no_) {
        return (yesBets[id][user], noBets[id][user]);
    }

    function totalPool(uint256 id) external view returns (uint256) {
        return uint256(markets[id].yesPool) + uint256(markets[id].noPool);
    }
}
