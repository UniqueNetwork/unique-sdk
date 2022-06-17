# Get Collection by ID

## [Readable](#) method

Returns collection info in human format.

## Arguments

- ***collectionId*** - _id of collection_

## Returns
- **id** - Collection unique ID
- **owner** - The address of collection owner
- **name** - Collection name (UTF-16 array, up to 64 characters)
- **description** - Collection description (UTF-16, up to 256 characters)
- **mode** - The collection type (`Nft`, `Fungible`, or `ReFungible`)
- **tokenPrefix** - Token prefix (UTF-8, up to 4 characters)
- **sponsorship** - This field tells if sponsorship is enabled and what address is the current collection sponsor.
- **limits** - Collection limits
- **permissions** - Collection permissions
- **properties** - Collection properties
- **tokenPropertyPermissions** - Collection tokens permissions

<details>
 <summary>JSON example </summary>

```JSON
{
  "id": 426,
  "owner": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty",
  "mode": "NFT",
  "name": "foo_836",
  "description": "bar",
  "tokenPrefix": "BAZ",
  "sponsorship": null,
  "limits": {
    "accountTokenOwnershipLimit": null,
    "sponsoredDataSize": null,
    "sponsoredDataRateLimit": null,
    "tokenLimit": null,
    "sponsorTransferTimeout": null,
    "sponsorApproveTimeout": null,
    "ownerCanTransfer": null,
    "ownerCanDestroy": null,
    "transfersEnabled": null
  },
  "permissions": {
    "access": "Normal",
    "mintMode": false,
    "nesting": "Disabled"
  },
  "properties": {
    "constOnChainSchema": {
      "nested": {
        "onChainMetaData": {
          "nested": {
            "NFTMeta": {
              "fields": {
                "field1": {
                  "id": 1,
                  "rule": "required",
                  "type": "string"
                },
                "field2": {
                  "id": 2,
                  "rule": "optional",
                  "type": "field2"
                }
              }
            },
            "field2": {
              "options": {
                "field1": "a",
                "field2": "b",
                "field3": "c"
              },
              "values": {
                "field1": 0,
                "field2": 1,
                "field3": 2
              }
            }
          }
        }
      }
    },
    "fields": [
      {
        "type": "text",
        "name": "field1",
        "required": true
      },
      {
        "type": "select",
        "name": "field2",
        "items": ["a", "b", "c"],
        "required": false
      }
    ]
  },
  "tokenPropertyPermissions": {
    "constData": {
      "mutable": false,
      "collectionAdmin": true,
      "tokenOwner": true
    }
  }
}
```

</details>
