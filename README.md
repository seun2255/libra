# Libra

Decentraized File Storage App

Libra enables people to upload content ontoo the IPFS and create storage deals on the filecoin network that keeps these files pinned on the IPFS. Uploaded files can be encrypted, monetised and grouped together into
Communites that many people can contribute to.

- ### [Libra](https://tutorial-haven.vercel.app/)

## Resources

- #### [Main Contract](https://calibration.filfox.info/en/address/0xa403e956d0fB10d9114d4252AE7753EC639BB00d)

- #### [Token Contract](https://calibration.filfox.info/en/address/0xC6d35d60BC39EBCcE95D915b757bb59d63192596)

- #### [Table Row Access Control Contract](https://calibration.filfox.info/en/address/0x7AFf8aB1394b17F1Efc074A5Cda33FFC3fB0Ee22)

- #### Table Land Tables
- - Files Table: libra_314159_547
- - Communities Table: libra_communities_314159_548

## What it does

Libra makes storage of files on the filecoin network easy. It enables people to upload content and create storage deals on the filecoin network for uploaded files, and all this in a simple and nice UI. Uploaded files can be monetised, encrypted and grouped together into Communities so that many people can contribute to a collective dataset.

## Inspiration

Patreon is a huge inspiration for this proect, The main objective of the app is to be able to group content together into communities that require permission to access. This enables multiple creatives to upload related content and ensure only the expected viewers can access it.

## How I built it

- I used Next.js to build out the frontend.
- I wrote smart contracts on the filecoin calibration testnet and use lighouse.storage to create storage deals on the calibration tesstnet.
- Lighthouse.storage was used to upload content and to encrypt, decrypt and apply custom access controls for grouped content (Communities), in the main contract a view function that checks if an address is a member of a community was used as the custom access control condition with lightouse.
- I used tableand as the database for the app, it was used to keep the infromation of all uploaded files in a table, this made it easier to query data as i was able to make sql queries for getting certain files with filters like address of the uploader. I also use tableland contracts to create a table for each created communty and ensure only members of the community would be able to insert data into a communities table.
- I used Dataverseos to connevt the users wallet to the app and to create a profile for each user that keeps sensitive information like their personal data.

## Challenges I ran into

This is my first app that uses the filecoin calibration testnet so i had a short issue with deployeent of contracts that was quickly solved by the mentors.
i don't know SQL so i had to learn a bit of that to work with tableland, made small mistakes in the statement that made it so that tables werent being created until i recieved a tip that my SQL was wrong by a mentor.
Understanding just how best to use the technologies was a bit of hassle too, it took me time before i realised that dataverse was best for personal data, Tableland for tables and how to use lighthouse file encryption to make it so that even though any one can query data from a communities table they wont be able to actually access the content without being a member.

## What I learned

I learnt the basics of SQL as i needed that for tableland.
I learnt a lot aout the IPFS, FVM and filecoin network and the whole processs behind creating storage deals.
Working with lighthouse taught me a great way to securely upload files online that only the expected people can access.

## What's next for Libra

Theres a whole lot that will be done, an improvement on the UI, more options for applying access control to communities and files like NFT based access, for example an author giving buyers of a book an NFT that will give them access to all their extra content that's secured in a community on Libra.
