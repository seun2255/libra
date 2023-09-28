// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./Prime.sol";
import "./Community.sol";

contract Libra is Ownable {
    // table info
    uint256 private fileTableId; // Unique table ID
    string private constant _FILE_TABLE_PREFIX = "libra"; // Custom table prefix
    uint256 private communitiesTableId; // Unique table ID
    string private constant _COMMUNITIES_TABLE_PREFIX = "libra_communities"; // Custom table prefix
    string private constant _COMMUNITY_TABLE_PREFIX = "libra_community"; // Custom table prefix
    mapping(uint256 => address[]) fileAccess;
    mapping(uint256 => FileData) fileDetails;

    using Counters for Counters.Counter;
    Counters.Counter private _communityId;
    Counters.Counter private _fileId;

    Prime public tokenContract;
    address private tokenContractAddress;
    address private rowControllerAddress;

    struct FileData {
        address paymentAddress;
        uint256 cost;
    }

    // Creating table with `id`, `type`, `url`, `title` and `private`  columns
    constructor(address _tokenContractAddress, address _rowController) {
        tokenContract = Prime(_tokenContractAddress);
        tokenContractAddress = _tokenContractAddress;
        rowControllerAddress = _rowController;

        // Creating libra files table
        fileTableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key,"
                "address text,"
                "type text,"
                "url text,"
                "hash text,"
                "title text,"
                "description text,"
                "tags text,"
                "access text,"
                "cost text,"
                "createdAt text",
                _FILE_TABLE_PREFIX
            )
        );

        // Creating libra communities table
        communitiesTableId = TablelandDeployments.get().create(
            address(this),
            SQLHelpers.toCreateFromSchema(
                "id integer primary key,"
                "address text,"
                "title text,"
                "description text,"
                "files text,"
                "accessfee text,"
                "contract text",
                _COMMUNITIES_TABLE_PREFIX
            )
        );
    }

    function getFilesTableName()
        external
        view
        onlyOwner
        returns (string memory)
    {
        string memory tableName = SQLHelpers.toNameFromId(
            _FILE_TABLE_PREFIX,
            fileTableId
        );
        return tableName;
    }

    function getCommunitiesTableName()
        external
        view
        onlyOwner
        returns (string memory)
    {
        string memory tableName = SQLHelpers.toNameFromId(
            _COMMUNITIES_TABLE_PREFIX,
            communitiesTableId
        );
        return tableName;
    }

    // Needed for the contract to own a table
    function onERC721Received(
        address,
        address,
        uint256,
        bytes calldata
    ) external pure returns (bytes4) {
        return IERC721Receiver.onERC721Received.selector;
    }

    /**
     * Tableland Functions
     */

    // Let anyone insert into the table
    function insertIntoTable(
        string memory _type,
        string memory _url,
        string memory _hash,
        string memory _title,
        string memory _description,
        string memory _tags,
        string memory _access,
        string memory _cost,
        string memory _createdAt
    ) public {
        TablelandDeployments.get().mutate(
            address(this), // Table owner, i.e., this contract
            fileTableId,
            SQLHelpers.toInsert(
                _FILE_TABLE_PREFIX,
                fileTableId,
                "address,type,url,hash,title,description,tags,access,cost,createdAt",
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote(_type),
                    ",",
                    SQLHelpers.quote(_url),
                    ",",
                    SQLHelpers.quote(_hash),
                    ",",
                    SQLHelpers.quote(_title),
                    ",",
                    SQLHelpers.quote(_description),
                    ",",
                    SQLHelpers.quote(_tags),
                    ",",
                    SQLHelpers.quote(_access),
                    ",",
                    SQLHelpers.quote(_cost),
                    ",",
                    SQLHelpers.quote(_createdAt)
                )
            )
        );
    }

    //Update only the row that the caller inserted
    function updateTable(
        string memory _type,
        string memory _url,
        string memory _hash,
        string memory _title,
        string memory _description,
        string memory _tags,
        string memory _access,
        string memory _cost,
        string memory _createdAt,
        string memory _id
    ) external {
        // Set the values to update
        string memory setters = string.concat(
            SQLHelpers.quote(_type),
            ",",
            SQLHelpers.quote(_url),
            ",",
            SQLHelpers.quote(_hash),
            ",",
            SQLHelpers.quote(_title),
            ",",
            SQLHelpers.quote(_description),
            ",",
            SQLHelpers.quote(_tags),
            ",",
            SQLHelpers.quote(_access),
            ",",
            SQLHelpers.quote(_cost),
            ",",
            SQLHelpers.quote(_createdAt)
        );
        // Specify filters for which row to update
        string memory filters = string.concat(
            "address=",
            SQLHelpers.quote(Strings.toHexString(msg.sender)),
            ",",
            "id=",
            _id
        );
        // Mutate a row at `address` with a new `val`—gating for the correct row is handled by the controller contract
        TablelandDeployments.get().mutate(
            address(this),
            fileTableId,
            SQLHelpers.toUpdate(
                _FILE_TABLE_PREFIX,
                fileTableId,
                setters,
                filters
            )
        );
    }

    //Inserting and Updating Communities Table
    function insertIntoCommunitiesTable(
        string memory _title,
        string memory _description,
        string memory _files,
        string memory _accessfee,
        address _contract
    ) public {
        TablelandDeployments.get().mutate(
            address(this), // Table owner, i.e., this contract
            communitiesTableId,
            SQLHelpers.toInsert(
                _COMMUNITIES_TABLE_PREFIX,
                communitiesTableId,
                "address,title,description,files,accessfee,contract",
                string.concat(
                    SQLHelpers.quote(Strings.toHexString(msg.sender)),
                    ",",
                    SQLHelpers.quote(_title),
                    ",",
                    SQLHelpers.quote(_description),
                    ",",
                    SQLHelpers.quote(_files),
                    ",",
                    SQLHelpers.quote(_accessfee),
                    ",",
                    SQLHelpers.quote(Strings.toHexString(_contract))
                )
            )
        );
    }

    //Update only the row that the caller inserted
    function updateCommunitiesTable(
        string memory _title,
        string memory _description,
        string memory _tags,
        string memory _access,
        string memory _files,
        string memory _createdAt,
        string memory _id
    ) external {
        // Set the values to update
        string memory setters = string.concat(
            SQLHelpers.quote(_title),
            ",",
            SQLHelpers.quote(_description),
            ",",
            SQLHelpers.quote(_tags),
            ",",
            SQLHelpers.quote(_access),
            ",",
            SQLHelpers.quote(_files),
            ",",
            SQLHelpers.quote(_createdAt)
        );
        // Specify filters for which row to update
        string memory filters = string.concat(
            "address=",
            SQLHelpers.quote(Strings.toHexString(msg.sender)),
            ",",
            "id=",
            _id
        );
        // Mutate a row at `address` with a new `val`—gating for the correct row is handled by the controller contract
        TablelandDeployments.get().mutate(
            address(this),
            communitiesTableId,
            SQLHelpers.toUpdate(
                _COMMUNITIES_TABLE_PREFIX,
                communitiesTableId,
                setters,
                filters
            )
        );
    }

    // Sets the ACL controller to enable row-level writes with dynamic policies
    function setAccessControl(address controller) external onlyOwner {
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            fileTableId,
            controller // Set the controller address—a separate controller contract
        );

        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            communitiesTableId,
            controller // Set the controller address—a separate controller contract
        );
    }

    function uploadFile(
        string memory _title,
        string memory _description,
        string memory _type,
        string memory _url,
        string memory _hash,
        string memory _tags,
        string memory _access,
        string memory _fileCost,
        string memory _createdAt,
        uint256 _cost
    ) external {
        _fileId.increment();

        uint256 filesId = _fileId.current();

        fileDetails[filesId] = FileData(msg.sender, _cost * 10 ** 18);
        insertIntoTable(
            _type,
            _url,
            _hash,
            _title,
            _description,
            _tags,
            _access,
            _fileCost,
            _createdAt
        );
        fileAccess[filesId].push(msg.sender);
    }

    function hasAccess(uint256 _id) public view returns (bool) {
        if (fileDetails[_id].cost == 0) {
            return true;
        }

        for (uint256 i = 0; i < fileAccess[_id].length; i++) {
            if (fileAccess[_id][i] == msg.sender) {
                return true; // Address found in the array
            }
        }
        return false; // Address not found in the array
    }

    function payForAccess(uint256 _id) public {
        require(
            tokenContract.allowance(msg.sender, address(this)) >=
                fileDetails[_id].cost,
            "Allowance not enough"
        );

        // Transfer tokens from msg.sender to the payment address
        tokenContract.transferFrom(
            msg.sender,
            fileDetails[_id].paymentAddress,
            fileDetails[_id].cost
        );
        fileAccess[_id].push(msg.sender);
    }

    //Community Fuctions
    function createCommunity(
        string memory _title,
        string memory _description,
        string memory _accessfee,
        uint256 _cost

    ) public {
        Community newCommunity = new Community(tokenContractAddress, _cost);
        newCommunity.setAccessControl(rowControllerAddress);
        string memory tableName = newCommunity.getFilesTableName();
        address contractAddress = newCommunity.getContractAddress(); 


        insertIntoCommunitiesTable(
            _title,
            _description,
            tableName,
            _accessfee,
            contractAddress
        );
    }
}
