# Get Collection by ID

## [Readable](#) method

Returns collection info in human format.

## Arguments

- ***collectionId*** - _id of collection_

## Returns
```JSON
{
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
  },
  "id": 426,
  "owner": "5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty"
}
```

- ***name*** - _name of collection, string 124 length_
- ***description*** - _description of collection, string 256 length_
