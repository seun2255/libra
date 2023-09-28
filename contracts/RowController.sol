// SPDX-License-Identifier: MIT
pragma solidity >=0.8.10 <0.9.0;

import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {SQLHelpers} from "@tableland/evm/contracts/utils/SQLHelpers.sol";
import {TablelandController} from "@tableland/evm/contracts/TablelandController.sol";
import {TablelandPolicy} from "@tableland/evm/contracts/TablelandPolicy.sol";
import {Policies} from "@tableland/evm/contracts/policies/Policies.sol";

contract RowController is TablelandController, Ownable {
    function getPolicy(
        address caller,
        uint256
    ) public payable override returns (TablelandPolicy memory) {
        // Return allow-all policy if the caller is the owner
        if (caller == owner()) {
            return
                TablelandPolicy({
                    allowInsert: true,
                    allowUpdate: true,
                    allowDelete: true,
                    whereClause: "",
                    withCheck: "",
                    updatableColumns: new string[](0)
                });
        }

        // For all others, we'll let anyone insert but have controls on the update
        // First, establish WHERE clauses (i.e., where the address it the caller)
        string[] memory whereClause = new string[](1);
        whereClause[0] = string.concat(
            "address=",
            SQLHelpers.quote(Strings.toHexString(caller))
        );

        // Restrict updates to a single `val` column
        string[] memory updatableColumns = new string[](3);
        updatableColumns[0] = "title";
        updatableColumns[1] = "description";
        updatableColumns[2] = "tags";

        // Now, return the policy that gates by the WHERE clause & updatable columns
        // Note: insert calls won't need to check these additional parameters; they're just for the updates
        return
            TablelandPolicy({
                allowInsert: true,
                allowUpdate: true,
                allowDelete: false,
                whereClause: Policies.joinClauses(whereClause),
                withCheck: "",
                updatableColumns: updatableColumns
            });
    }
}
