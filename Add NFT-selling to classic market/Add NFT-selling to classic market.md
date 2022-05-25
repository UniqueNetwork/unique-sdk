**Add NFT-selling to classic market**



To connect the marketplace to the Polkadot blockchain, we need a REST-api (unique-SDK) to work with the Unique infrastructure ( <https://github.com/UniqueNetwork/unique-sdk> ).

You also need to familiarize yourself with the corresponding methods of this library ( <https://github.com/UniqueNetwork/unique-sdk/blob/develop/packages/web/README.md> ) .

Sample methods are also available in Swagger ( <https://web.uniquenetwork.dev/swagger/#/> ).

There is a separate library for loading images for NFT, from where we will need one method:

<https://image-uploader.unique.network/api/docs/>

Previously, it is necessary to provide a button or a link on the marketplace resource for buying NFT near (under) the image of the physical (real) picture.

Also, in order to connect to the Polkadot blockchain, you need to create a substrate address for your resource (STEP 1). The registration procedure takes place separately at https://polkadot.js.org or <https://wallet.unique.network/> .

After registering for Polkadot.JS, you can create your own collections. 

You need to create your own collection for an existing art gallery in accordance with the rule “A picture is an NFT digital token” (STEP 2).

To create a collection, you can use the web interface:

Log in to minter <https://minter-quartz.unique.network/#/builder/collections> 

Make sure that there are funds on the account and click the “Create collection” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.001.png)

Fill in the required fields and click the “Confirm” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.002.png)

Select and upload an image up to 10 mb and click the “Confirm” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.003.png)



Fill in the required fields and click the “Confirm” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.004.png)

Sign the transaction by entering the password and clicking the “Sign and Submit” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.005.png)

CREATE NFT (via web)

We now have a collection created for which we can create our first NFT by clicking on the “Create NFT” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.006.png)

Upload an image and fill in the fields, then click the “Confirm” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.007.png)

Sign the transaction by entering the password and clicking the “Sign and Submit” button

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.008.png)

Now in our collection 1 item

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.009.png)

If we want to view our token, we need to log in to the wall using the link <https://wallet.unique.network/#/myStuff/nft> 

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.010.png)

Click on the image of the token and open the full list of parameters

![](Aspose.Words.126ef526-4778-4da5-be84-9d036c121bce.011.png) 

Or use the API.

The procedural sequence is divided into the following steps:

\- collection minting (minter collection can be viewed here: <https://minter-quartz.unique.network/> )

\- minting / sending a token - confirmation of sending a token here ( <https://uniquescan.io/QUARTZ> )

\- for testing, you can use the Opal test network ( https://wallet.dev.uniquenetwork.dev, https://minter-opal.unique.network/ and <https://wallet-opal.unique.network/> )

\- to receive funds on opal - use the bot ( <https://t.me/unique2faucet_opal_bot> )

An example of creating a collection:

Procedurally:

\- extrinsic building (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_buildTx> )

\- extrinsic signature (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_sign> )

\- sending an extrinsic to the chain (<https://web.uniquenetwork.dev/swagger/#/extrinsic/ExtrinsicsController_submitTx> )

POST\collection method

<https://github.com/UniqueNetwork/uniquesdk/blob/develop/packages/web/README.md> 

Swagger:

<https://web.uniquenetwork.dev/swagger/#/collection/CollectionController_createCollection> 

Next, we create a digital token, for which we use the POST \api\images\upload method ( <https://image-uploader.unique.network/api/docs/#/default/ImageController_uploadImage> ) and first upload the image, we get an encrypted link to image (STEP 3.1)

And then using the POST \Token method (example: <https://web.uniquenetwork.dev/swagger/#/token/TokenController_createToken> ) (STEP 3.2), using the previously received encrypted link to the image - create a token of this image, NFT is ready for sale on the marketplace.

Requirements for the NFT buyer.

The NFT buyer must also have a substrate address in the Polkadot\Unique network (Registration at https://polkadot.js.org ). Otherwise, the creation of a substrate address is done by analogy (link to an example of work - <https://wallet.dev.uniquenetwork.dev> - or -  <https://github.com/UniqueNetwork/unique-sdk/tree/develop/recipes/add-nft-selling-to-classic-market/src> .

In the NFT purchase menu, it is necessary to provide a field for entering the client's substrate address, to which the token will be received after payment for fiat.

The purchase mechanism is assumed to be as follows:

\- the client selects the NFT he would like to purchase;

\- a menu opens where he enters his substrate address and data for paying for fiat;

\- the client pays for the purchase in fiat and NFT is sent to his substrate address.

At this time, the token is created (STEP 1-3.2) and then:

\- when fiats are credited to the seller's account, NFT ownership rights are transferred from the seller's substrate address to the substrate address specified by the buyer. (method PATCH \token\transfer) - similar to creating a token:

\- form an extrusion

\- sign

\- send to chain

An example of a transfer is provided in Swagger - <https://web.uniquenetwork.dev/swagger/#/token/TokenController_transferToken> .
