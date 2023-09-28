// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;


import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {IERC721Receiver} from "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
import {TablelandDeployments} from "@tableland/evm/contracts/utils/TablelandDeployments.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import "./Prime.sol";

contract Community is Ownable {
    
    uint256 private accessFee;
    address[] public members;

    Prime public tokenContract;

    // table info
    uint256 private fileTableId; // Unique table ID
    string private constant _FILE_TABLE_PREFIX = "libra_community"; // Custom table prefix

     // Creating table with `id`, `type`, `url`, `title` and `private`  columns
    constructor(address _tokenContractAddress, uint256 _fee) {
        tokenContract = Prime(_tokenContractAddress);
        accessFee = _fee;

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
                "createdAt text",
                _FILE_TABLE_PREFIX
            )
        );
    }

    function getFilesTableName()
        external
        view
        returns (string memory)
    {
        string memory tableName = SQLHelpers.toNameFromId(
            _FILE_TABLE_PREFIX,
            fileTableId
        );
        return tableName;
    }

    function getContractAddress() external view returns (address) {
        return address(this);
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
        string memory _createdAt
    ) public {
        TablelandDeployments.get().mutate(
            address(this), // Table owner, i.e., this contract
            fileTableId,
            SQLHelpers.toInsert(
                _FILE_TABLE_PREFIX,
                fileTableId,
                "address,type,url,hash,title,description,tags,createdAt",
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

    // Sets the ACL controller to enable row-level writes with dynamic policies
    function setAccessControl(address controller) external {
        TablelandDeployments.get().setController(
            address(this), // Table owner, i.e., this contract
            fileTableId,
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
        string memory _createdAt
    ) external {
        insertIntoTable(
            _type,
            _url,
            _hash,
            _title,
            _description,
            _tags,
            _createdAt
        );
    }

    function joinCommunity() public returns (bool) {
        require(tokenContract.balanceOf(msg.sender) > accessFee, "Don't have enough tokens");
        if (accessFee == 0) {
            members.push(msg.sender);
            return true;
        }
        tokenContract.transfer(address(this), accessFee);
        members.push(msg.sender);
        return true;
    }

    function isMember() public view returns (bool) {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i] == msg.sender) {
                return true; // Address found in the array
            }
        }
        return false; // Address not found in the array
    }
}
