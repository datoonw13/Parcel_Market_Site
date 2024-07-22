import { IAuthSliceInitial } from "@/types/auth";
import { IFindPropertyEstimatedPriceResponse, ISellProperty } from "@/types/find-property";
import { IMap } from "@/types/map";
import { aboutLandSchema } from "@/zod-validations/value-land-validations";
import { atom } from "jotai";
import { z } from "zod";

const testData = {
  "aboutLand": null,
  "calculatedPrice": {
      "owner": "SURF ROAD ASSOCIATES LLC",
      "state": "ga",
      "county": "taylor",
      "propertyType": "",
      "parcelNumber": "010    015",
      "price": 527547,
      "price_sum": 20568210.682676993,
      "median_middle_price": 2499.9848837560844,
      "acrage": 186.38461,
      "lastsalesprice": 435000,
      "lastsalesdate": "2024-05-31",
      "user_id": null,
      "legalDescription": null,
      "apiOwnerName": null,
      "lotSize": null,
      "salePrice": null,
      "saleYear": null,
      "id": 649,
      "accepted": false,
      "dateCreated": "2024-07-22T11:34:47.383Z",
      "range": {
          "min": 1395,
          "max": 4927
      },
      "properties": [
          {
              "owner": null,
              "parselId": "003 026",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 110,
              "price": 315000,
              "isValid": true,
              "lastSalesPrice": 315000,
              "lastSalesDate": "2022-10-12",
              "address": "MAUK, GA 31058",
              "isMedianValid": true,
              "latitude": "32.504595",
              "longitude": "-84.429079",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "87 8F",
              "propertyType": "AGRICULTURAL/RURAL (GENERAL)",
              "arcage": 240.27,
              "price": 480000,
              "isValid": true,
              "lastSalesPrice": 480000,
              "lastSalesDate": "2023-12-28",
              "address": "MAUK, GA 31058",
              "isMedianValid": true,
              "latitude": "32.496829",
              "longitude": "-84.439372",
              "state": "Georgia",
              "county": "Marion County"
          },
          {
              "owner": null,
              "parselId": "65 14A",
              "propertyType": "AGRICULTURAL/RURAL (GENERAL)",
              "arcage": 110,
              "price": 415000,
              "isValid": true,
              "lastSalesPrice": 415000,
              "lastSalesDate": "2023-09-25",
              "address": "MAUK, GA 31058",
              "isMedianValid": true,
              "latitude": "32.440325",
              "longitude": "-84.470979",
              "state": "Georgia",
              "county": "Marion County"
          },
          {
              "owner": null,
              "parselId": "05032050001",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 234.82,
              "price": 404800,
              "isValid": true,
              "lastSalesPrice": 404800,
              "lastSalesDate": "2023-06-12",
              "address": "MAUK, GA 31058",
              "isMedianValid": true,
              "latitude": "32.414583",
              "longitude": "-84.367285",
              "state": "Georgia",
              "county": "Schley County"
          },
          {
              "owner": null,
              "parselId": "93 8",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 119.06,
              "price": 435000,
              "isValid": true,
              "lastSalesPrice": 435000,
              "lastSalesDate": "2024-05-31",
              "address": "BUENA VISTA, GA 31803",
              "isMedianValid": true,
              "latitude": "32.401049",
              "longitude": "-84.408366",
              "state": "Georgia",
              "county": "Marion County"
          },
          {
              "owner": null,
              "parselId": "57 18",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 255.86,
              "price": 375000,
              "isValid": true,
              "lastSalesPrice": 375000,
              "lastSalesDate": "2023-09-19",
              "address": "BUENA VISTA, GA 31803",
              "isMedianValid": true,
              "latitude": "32.446981",
              "longitude": "-84.497174",
              "state": "Georgia",
              "county": "Marion County"
          },
          {
              "owner": null,
              "parselId": "031 015",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 330.77,
              "price": 826920,
              "isValid": true,
              "lastSalesPrice": 826920,
              "lastSalesDate": "2022-10-18",
              "address": ", GA ",
              "isMedianValid": true,
              "latitude": "32.511989",
              "longitude": "-84.317084",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "033 004 C",
              "propertyType": "AGRICULTURAL/RURAL (GENERAL)",
              "arcage": 162.93,
              "price": 459000,
              "isValid": true,
              "lastSalesPrice": 459000,
              "lastSalesDate": "2022-09-28",
              "address": "BUTLER, GA 31006",
              "isMedianValid": true,
              "latitude": "32.454438",
              "longitude": "-84.306047",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "044 027 A",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 115,
              "price": 487000,
              "isValid": true,
              "lastSalesPrice": 487000,
              "lastSalesDate": "2023-03-15",
              "address": "BUTLER, GA 31006",
              "isMedianValid": true,
              "latitude": "32.476721",
              "longitude": "-84.289823",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "62 14",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 203.16,
              "price": 400000,
              "isValid": true,
              "lastSalesPrice": 400000,
              "lastSalesDate": "2023-03-24",
              "address": "MAUK, GA 31058",
              "isMedianValid": true,
              "latitude": "32.546952",
              "longitude": "-84.487068",
              "state": "Georgia",
              "county": "Marion County"
          },
          {
              "owner": null,
              "parselId": "035 002",
              "propertyType": "AGRICULTURAL/RURAL (GENERAL)",
              "arcage": 194.23,
              "price": 650670,
              "isValid": true,
              "lastSalesPrice": 650670,
              "lastSalesDate": "2023-01-23",
              "address": "RUPERT, GA 31081",
              "isMedianValid": true,
              "latitude": "32.400894",
              "longitude": "-84.316830",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "047 017",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 250.64,
              "price": 1235000,
              "isValid": true,
              "lastSalesPrice": 1235000,
              "lastSalesDate": "2022-10-06",
              "address": "RUPERT, GA 31081",
              "isMedianValid": true,
              "latitude": "32.380336",
              "longitude": "-84.293454",
              "state": "Georgia",
              "county": "Taylor County"
          },
          {
              "owner": null,
              "parselId": "21031230001",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 116,
              "price": 297424,
              "isValid": true,
              "lastSalesPrice": 297424,
              "lastSalesDate": "2022-10-07",
              "address": "ELLAVILLE, GA 31806",
              "isMedianValid": true,
              "latitude": "32.363983",
              "longitude": "-84.311719",
              "state": "Georgia",
              "county": "Schley County"
          },
          {
              "owner": null,
              "parselId": "20031320001",
              "propertyType": "PRIVATE PRESERVE, OPEN SPACE - VACANT LAND",
              "arcage": 206.4,
              "price": 665000,
              "isValid": true,
              "lastSalesPrice": 665000,
              "lastSalesDate": "2022-10-06",
              "address": "ELLAVILLE, GA 31806",
              "isMedianValid": true,
              "latitude": "32.368271",
              "longitude": "-84.289166",
              "state": "Georgia",
              "county": "Schley County"
          }
      ],
      "propertyId": 649
  },
  "lands": [
      {
          "type": "Feature",
          "geometry": {
              "type": "Polygon",
              "coordinates": [
                  [
                      [
                          -84.3912255,
                          32.4353765
                      ],
                      [
                          -84.3914335,
                          32.4356455
                      ],
                      [
                          -84.3914745,
                          32.4356595
                      ],
                      [
                          -84.392166,
                          32.4356775
                      ],
                      [
                          -84.3922285,
                          32.4276555
                      ],
                      [
                          -84.3922345,
                          32.4268375
                      ],
                      [
                          -84.3922345,
                          32.426837
                      ],
                      [
                          -84.3922275,
                          32.423722
                      ],
                      [
                          -84.392236,
                          32.4232375
                      ],
                      [
                          -84.391155,
                          32.423298
                      ],
                      [
                          -84.390027,
                          32.4233455
                      ],
                      [
                          -84.3887235,
                          32.42342
                      ],
                      [
                          -84.388534,
                          32.422175
                      ],
                      [
                          -84.3884725,
                          32.421615
                      ],
                      [
                          -84.387889,
                          32.4221335
                      ],
                      [
                          -84.387175,
                          32.4229015
                      ],
                      [
                          -84.386308,
                          32.4238535
                      ],
                      [
                          -84.3865815,
                          32.4240745
                      ],
                      [
                          -84.387044,
                          32.424299
                      ],
                      [
                          -84.3873455,
                          32.4247495
                      ],
                      [
                          -84.3874395,
                          32.4252785
                      ],
                      [
                          -84.3877525,
                          32.4256895
                      ],
                      [
                          -84.388516,
                          32.425943
                      ],
                      [
                          -84.388863,
                          32.426168
                      ],
                      [
                          -84.389211,
                          32.426687
                      ],
                      [
                          -84.3895355,
                          32.42698
                      ],
                      [
                          -84.38994,
                          32.4270775
                      ],
                      [
                          -84.390229,
                          32.427018
                      ],
                      [
                          -84.3907955,
                          32.427282
                      ],
                      [
                          -84.391121,
                          32.427633
                      ],
                      [
                          -84.3912935,
                          32.42782
                      ],
                      [
                          -84.390738,
                          32.428192
                      ],
                      [
                          -84.3853915,
                          32.4317755
                      ],
                      [
                          -84.385408,
                          32.431916
                      ],
                      [
                          -84.385457,
                          32.4320195
                      ],
                      [
                          -84.385676,
                          32.4322265
                      ],
                      [
                          -84.385897,
                          32.432342
                      ],
                      [
                          -84.386067,
                          32.4325275
                      ],
                      [
                          -84.386165,
                          32.4327255
                      ],
                      [
                          -84.386343,
                          32.4330575
                      ],
                      [
                          -84.386513,
                          32.4332235
                      ],
                      [
                          -84.3867965,
                          32.433353
                      ],
                      [
                          -84.387254,
                          32.4334835
                      ],
                      [
                          -84.3876785,
                          32.433596
                      ],
                      [
                          -84.3882245,
                          32.433809
                      ],
                      [
                          -84.3884405,
                          32.4338835
                      ],
                      [
                          -84.3885295,
                          32.4337475
                      ],
                      [
                          -84.38873,
                          32.43354
                      ],
                      [
                          -84.3888715,
                          32.4337075
                      ],
                      [
                          -84.3894645,
                          32.433926
                      ],
                      [
                          -84.3896485,
                          32.4339965
                      ],
                      [
                          -84.389705,
                          32.434018
                      ],
                      [
                          -84.3898995,
                          32.4342195
                      ],
                      [
                          -84.3900505,
                          32.434514
                      ],
                      [
                          -84.3901875,
                          32.43473
                      ],
                      [
                          -84.3904275,
                          32.4348955
                      ],
                      [
                          -84.3907115,
                          32.434877
                      ],
                      [
                          -84.3909135,
                          32.435034
                      ],
                      [
                          -84.391069,
                          32.435203
                      ],
                      [
                          -84.3912185,
                          32.4353675
                      ],
                      [
                          -84.3912255,
                          32.4353765
                      ]
                  ]
              ]
          },
          "properties": {
              "headline": "Buena Vista Hwy",
              "path": "/us/ga/taylor/rupert/839",
              "fields": {
                  "ogc_fid": 839,
                  "geoid": "13269",
                  "parcelnumb": "012    002",
                  "parcelnumb_no_formatting": "012002",
                  "account_number": "2027",
                  "alt_parcelnumb1": "2027",
                  "usecode": "J5",
                  "owner": "SURF ROAD ASSOCIATES LLC",
                  "mailadd": "P.O. Box 4446",
                  "mail_city": "ATLANTA",
                  "mail_state2": "GA",
                  "mail_zip": "30308",
                  "address": "BUENA VISTA HWY",
                  "saddno": "0",
                  "saddstr": "BUENA VISTA",
                  "saddsttyp": "HWY",
                  "original_address": "{\"address\":\"BUENA VISTA HWY\",\"saddno\":\"0\",\"saddstr\":\"BUENA VISTA HWY\"}",
                  "city": "rupert",
                  "county": "taylor",
                  "state2": "GA",
                  "szip": "31058",
                  "szip5": "31058",
                  "address_source": "county",
                  "legaldesc": "118 AC COUNTY LINE 392.59 TOTAL ACRES",
                  "lot": "243",
                  "lat": "32.429037",
                  "lon": "-84.389786",
                  "qoz": "Yes",
                  "qoz_tract": "13269950300",
                  "census_tract": "13269950301",
                  "census_block": "132699503012107",
                  "census_blockgroup": "132699503012",
                  "census_zcta": "31058",
                  "ll_last_refresh": "2024-01-30",
                  "gisacre": 118,
                  "sqft": 5140080,
                  "ll_gisacre": 128.47497,
                  "ll_gissqft": 5596486,
                  "path": "/us/ga/taylor/rupert/839",
                  "ll_stable_id": "geometry",
                  "ll_uuid": "06eef5e4-cbba-4afc-9c57-a9ce86e539c5",
                  "ll_updated_at": "2024-04-08 03:28:08 -0400"
              },
              "context": {
                  "headline": "Rupert, GA",
                  "name": "Rupert, GA",
                  "path": "/us/ga/taylor/rupert",
                  "active": true
              },
              "ll_uuid": "06eef5e4-cbba-4afc-9c57-a9ce86e539c5"
          },
          "id": 39994665
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [
                              -84.4110565,
                              32.4700515
                          ],
                          [
                              -84.4110815,
                              32.469329
                          ],
                          [
                              -84.409942,
                              32.4696275
                          ],
                          [
                              -84.408788,
                              32.469929
                          ],
                          [
                              -84.409224,
                              32.4710555
                          ],
                          [
                              -84.409225,
                              32.4710595
                          ],
                          [
                              -84.409494,
                              32.4718735
                          ],
                          [
                              -84.40959,
                              32.472163
                          ],
                          [
                              -84.410034,
                              32.4734395
                          ],
                          [
                              -84.410434,
                              32.4743715
                          ],
                          [
                              -84.410953,
                              32.4755225
                          ],
                          [
                              -84.411041,
                              32.471629
                          ],
                          [
                              -84.4110475,
                              32.4709655
                          ],
                          [
                              -84.4110565,
                              32.4700515
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -84.399793,
                              32.471391
                          ],
                          [
                              -84.3982985,
                              32.471366
                          ],
                          [
                              -84.3981715,
                              32.472454
                          ],
                          [
                              -84.3981615,
                              32.4760465
                          ],
                          [
                              -84.3985875,
                              32.4760605
                          ],
                          [
                              -84.3987555,
                              32.47549
                          ],
                          [
                              -84.398827,
                              32.475255
                          ],
                          [
                              -84.3988835,
                              32.475085
                          ],
                          [
                              -84.398884,
                              32.475078
                          ],
                          [
                              -84.3988865,
                              32.47507
                          ],
                          [
                              -84.399047,
                              32.47457
                          ],
                          [
                              -84.399166,
                              32.474206
                          ],
                          [
                              -84.3991675,
                              32.474202
                          ],
                          [
                              -84.3993415,
                              32.473749
                          ],
                          [
                              -84.399461,
                              32.4733785
                          ],
                          [
                              -84.399549,
                              32.473125
                          ],
                          [
                              -84.399619,
                              32.4728565
                          ],
                          [
                              -84.3996245,
                              32.472818
                          ],
                          [
                              -84.399651,
                              32.47264
                          ],
                          [
                              -84.399652,
                              32.472458
                          ],
                          [
                              -84.3996115,
                              32.4721585
                          ],
                          [
                              -84.3996115,
                              32.4721555
                          ],
                          [
                              -84.3995905,
                              32.4719395
                          ],
                          [
                              -84.39959,
                              32.471933
                          ],
                          [
                              -84.399587,
                              32.4717215
                          ],
                          [
                              -84.399588,
                              32.4717085
                          ],
                          [
                              -84.399609,
                              32.471574
                          ],
                          [
                              -84.39961,
                              32.4715665
                          ],
                          [
                              -84.399611,
                              32.471563
                          ],
                          [
                              -84.3996155,
                              32.4715475
                          ],
                          [
                              -84.3996235,
                              32.471533
                          ],
                          [
                              -84.399627,
                              32.471528
                          ],
                          [
                              -84.399684,
                              32.471456
                          ],
                          [
                              -84.3996905,
                              32.471448
                          ],
                          [
                              -84.399704,
                              32.471437
                          ],
                          [
                              -84.3997185,
                              32.4714285
                          ],
                          [
                              -84.399793,
                              32.471391
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -84.4090195,
                              32.47111
                          ],
                          [
                              -84.408552,
                              32.4699005
                          ],
                          [
                              -84.40788,
                              32.4699995
                          ],
                          [
                              -84.407876,
                              32.47
                          ],
                          [
                              -84.4074745,
                              32.4700455
                          ],
                          [
                              -84.4070055,
                              32.4700975
                          ],
                          [
                              -84.4069975,
                              32.470098
                          ],
                          [
                              -84.406604,
                              32.470117
                          ],
                          [
                              -84.4062795,
                              32.4701445
                          ],
                          [
                              -84.405994,
                              32.470173
                          ],
                          [
                              -84.405713,
                              32.470202
                          ],
                          [
                              -84.4053465,
                              32.470247
                          ],
                          [
                              -84.404862,
                              32.4703555
                          ],
                          [
                              -84.4044295,
                              32.470447
                          ],
                          [
                              -84.403677,
                              32.470589
                          ],
                          [
                              -84.403052,
                              32.4707145
                          ],
                          [
                              -84.4026765,
                              32.470791
                          ],
                          [
                              -84.402044,
                              32.4709575
                          ],
                          [
                              -84.4014955,
                              32.471108
                          ],
                          [
                              -84.4009965,
                              32.471244
                          ],
                          [
                              -84.4009925,
                              32.471245
                          ],
                          [
                              -84.400569,
                              32.4713445
                          ],
                          [
                              -84.4002295,
                              32.4714165
                          ],
                          [
                              -84.400005,
                              32.4714955
                          ],
                          [
                              -84.3998485,
                              32.471574
                          ],
                          [
                              -84.399819,
                              32.471611
                          ],
                          [
                              -84.399801,
                              32.471726
                          ],
                          [
                              -84.399804,
                              32.471928
                          ],
                          [
                              -84.3998245,
                              32.4721395
                          ],
                          [
                              -84.3998655,
                              32.472443
                          ],
                          [
                              -84.399866,
                              32.4724535
                          ],
                          [
                              -84.399865,
                              32.472646
                          ],
                          [
                              -84.3998645,
                              32.472657
                          ],
                          [
                              -84.3998335,
                              32.4728655
                          ],
                          [
                              -84.3998305,
                              32.4728835
                          ],
                          [
                              -84.399829,
                              32.4728915
                          ],
                          [
                              -84.3997575,
                              32.4731675
                          ],
                          [
                              -84.3997555,
                              32.4731735
                          ],
                          [
                              -84.399667,
                              32.4734285
                          ],
                          [
                              -84.3995475,
                              32.473799
                          ],
                          [
                              -84.399546,
                              32.473803
                          ],
                          [
                              -84.3993715,
                              32.4742565
                          ],
                          [
                              -84.3992535,
                              32.4746185
                          ],
                          [
                              -84.3990975,
                              32.475103
                          ],
                          [
                              -84.399097,
                              32.4751105
                          ],
                          [
                              -84.3990945,
                              32.4751195
                          ],
                          [
                              -84.3990335,
                              32.475303
                          ],
                          [
                              -84.398963,
                              32.475535
                          ],
                          [
                              -84.398804,
                              32.476076
                          ],
                          [
                              -84.4005525,
                              32.476153
                          ],
                          [
                              -84.4027285,
                              32.476248
                          ],
                          [
                              -84.410929,
                              32.4765875
                          ],
                          [
                              -84.410942,
                              32.4760065
                          ],
                          [
                              -84.410233,
                              32.4744345
                          ],
                          [
                              -84.409832,
                              32.473499
                          ],
                          [
                              -84.40983,
                              32.4734935
                          ],
                          [
                              -84.409384,
                              32.4722125
                          ],
                          [
                              -84.409285,
                              32.4719135
                          ],
                          [
                              -84.4090195,
                              32.47111
                          ]
                      ]
                  ]
              ]
          },
          "properties": {
              "headline": "William Woodall Farm Rd",
              "path": "/us/ga/taylor/rupert/612",
              "fields": {
                  "ogc_fid": 612,
                  "geoid": "13269",
                  "parcelnumb": "010    015",
                  "parcelnumb_no_formatting": "010015",
                  "account_number": "2752",
                  "alt_parcelnumb1": "2752",
                  "usecode": "J5",
                  "owner": "SURF ROAD ASSOCIATES LLC",
                  "mailadd": "P.O. Box 4446",
                  "mail_city": "ATLANTA",
                  "mail_state2": "GA",
                  "mail_zip": "30308",
                  "address": "WILLIAM WOODALL FARM RD",
                  "saddno": "0",
                  "saddstr": "WILLIAM WOODALL FARM",
                  "saddsttyp": "RD",
                  "original_address": "{\"address\":\"WILLIAM WOODALL FARM RD\",\"saddno\":\"0\",\"saddstr\":\"WILLIAM WOODALL FARM RD\"}",
                  "city": "rupert",
                  "county": "taylor",
                  "state2": "GA",
                  "szip": "31058",
                  "szip5": "31058",
                  "address_source": "county",
                  "legaldesc": "TY 17-4 (188.30 AC,",
                  "lot": "6",
                  "lat": "32.473378",
                  "lon": "-84.405086",
                  "qoz": "Yes",
                  "qoz_tract": "13269950300",
                  "census_tract": "13269950301",
                  "census_block": "132699503012054",
                  "census_blockgroup": "132699503012",
                  "census_zcta": "31058",
                  "ll_last_refresh": "2024-01-30",
                  "gisacre": 188.3,
                  "sqft": 8202348,
                  "ll_gisacre": 186.38461,
                  "ll_gissqft": 8119082,
                  "path": "/us/ga/taylor/rupert/612",
                  "ll_stable_id": "address",
                  "ll_uuid": "98ca5cac-0c33-4cbd-b0e6-dd98857f93aa",
                  "ll_updated_at": "2024-04-08 03:28:08 -0400"
              },
              "context": {
                  "headline": "Rupert, GA",
                  "name": "Rupert, GA",
                  "path": "/us/ga/taylor/rupert",
                  "active": true
              },
              "ll_uuid": "98ca5cac-0c33-4cbd-b0e6-dd98857f93aa"
          },
          "id": 40000268
      },
      {
          "type": "Feature",
          "geometry": {
              "type": "MultiPolygon",
              "coordinates": [
                  [
                      [
                          [
                              -84.404875,
                              32.457492
                          ],
                          [
                              -84.406492,
                              32.456993
                          ],
                          [
                              -84.4073225,
                              32.4584955
                          ],
                          [
                              -84.411238,
                              32.4585055
                          ],
                          [
                              -84.411438,
                              32.443936
                          ],
                          [
                              -84.4110035,
                              32.443988
                          ],
                          [
                              -84.410759,
                              32.4440645
                          ],
                          [
                              -84.410408,
                              32.4442395
                          ],
                          [
                              -84.4097295,
                              32.444404
                          ],
                          [
                              -84.4094085,
                              32.4444425
                          ],
                          [
                              -84.4092635,
                              32.4444235
                          ],
                          [
                              -84.409134,
                              32.4443665
                          ],
                          [
                              -84.408821,
                              32.4440855
                          ],
                          [
                              -84.408699,
                              32.4440105
                          ],
                          [
                              -84.408546,
                              32.443967
                          ],
                          [
                              -84.4083705,
                              32.4439655
                          ],
                          [
                              -84.4078365,
                              32.444119
                          ],
                          [
                              -84.4075855,
                              32.4442605
                          ],
                          [
                              -84.407402,
                              32.4444665
                          ],
                          [
                              -84.40728,
                              32.4447635
                          ],
                          [
                              -84.407196,
                              32.4448815
                          ],
                          [
                              -84.4069825,
                              32.4450485
                          ],
                          [
                              -84.406586,
                              32.445182
                          ],
                          [
                              -84.406303,
                              32.4452125
                          ],
                          [
                              -84.4060285,
                              32.4451685
                          ],
                          [
                              -84.4058995,
                              32.445114
                          ],
                          [
                              -84.405594,
                              32.444756
                          ],
                          [
                              -84.405472,
                              32.4446495
                          ],
                          [
                              -84.404884,
                              32.4443785
                          ],
                          [
                              -84.4047295,
                              32.444158
                          ],
                          [
                              -84.404519,
                              32.443969
                          ],
                          [
                              -84.4043975,
                              32.44372
                          ],
                          [
                              -84.3983515,
                              32.4437765
                          ],
                          [
                              -84.398324,
                              32.445307
                          ],
                          [
                              -84.39824,
                              32.447238
                          ],
                          [
                              -84.3984555,
                              32.447406
                          ],
                          [
                              -84.3984605,
                              32.44741
                          ],
                          [
                              -84.3986825,
                              32.447608
                          ],
                          [
                              -84.398719,
                              32.4476405
                          ],
                          [
                              -84.398756,
                              32.4476725
                          ],
                          [
                              -84.3987925,
                              32.447705
                          ],
                          [
                              -84.3988295,
                              32.4477375
                          ],
                          [
                              -84.3988665,
                              32.4477695
                          ],
                          [
                              -84.398904,
                              32.447802
                          ],
                          [
                              -84.398941,
                              32.4478345
                          ],
                          [
                              -84.398978,
                              32.447867
                          ],
                          [
                              -84.399015,
                              32.4478995
                          ],
                          [
                              -84.3990525,
                              32.447932
                          ],
                          [
                              -84.3990895,
                              32.447965
                          ],
                          [
                              -84.3991265,
                              32.447998
                          ],
                          [
                              -84.399163,
                              32.448031
                          ],
                          [
                              -84.3991995,
                              32.448064
                          ],
                          [
                              -84.399236,
                              32.4480975
                          ],
                          [
                              -84.3992725,
                              32.4481315
                          ],
                          [
                              -84.3993085,
                              32.448165
                          ],
                          [
                              -84.399344,
                              32.4481995
                          ],
                          [
                              -84.39938,
                              32.448234
                          ],
                          [
                              -84.3994165,
                              32.4482695
                          ],
                          [
                              -84.399452,
                              32.4483055
                          ],
                          [
                              -84.399487,
                              32.448343
                          ],
                          [
                              -84.3995195,
                              32.448379
                          ],
                          [
                              -84.3995215,
                              32.448381
                          ],
                          [
                              -84.399552,
                              32.4484175
                          ],
                          [
                              -84.3995545,
                              32.4484205
                          ],
                          [
                              -84.3995835,
                              32.448458
                          ],
                          [
                              -84.399586,
                              32.4484615
                          ],
                          [
                              -84.399613,
                              32.4485
                          ],
                          [
                              -84.399617,
                              32.4485065
                          ],
                          [
                              -84.3996405,
                              32.448547
                          ],
                          [
                              -84.3996435,
                              32.448553
                          ],
                          [
                              -84.3996635,
                              32.448595
                          ],
                          [
                              -84.3996655,
                              32.4486005
                          ],
                          [
                              -84.3996825,
                              32.448644
                          ],
                          [
                              -84.399684,
                              32.448648
                          ],
                          [
                              -84.399698,
                              32.448692
                          ],
                          [
                              -84.399699,
                              32.448695
                          ],
                          [
                              -84.399711,
                              32.448739
                          ],
                          [
                              -84.399712,
                              32.448743
                          ],
                          [
                              -84.399722,
                              32.448787
                          ],
                          [
                              -84.399723,
                              32.448792
                          ],
                          [
                              -84.39973,
                              32.448837
                          ],
                          [
                              -84.3997305,
                              32.448841
                          ],
                          [
                              -84.399735,
                              32.448886
                          ],
                          [
                              -84.399735,
                              32.4488885
                          ],
                          [
                              -84.399738,
                              32.4489355
                          ],
                          [
                              -84.39974,
                              32.448981
                          ],
                          [
                              -84.399742,
                              32.4490265
                          ],
                          [
                              -84.3997435,
                              32.4490725
                          ],
                          [
                              -84.3997445,
                              32.4491185
                          ],
                          [
                              -84.399745,
                              32.449164
                          ],
                          [
                              -84.399745,
                              32.4492095
                          ],
                          [
                              -84.399745,
                              32.4492545
                          ],
                          [
                              -84.399745,
                              32.4492995
                          ],
                          [
                              -84.399745,
                              32.4493445
                          ],
                          [
                              -84.399745,
                              32.4493895
                          ],
                          [
                              -84.3997455,
                              32.449434
                          ],
                          [
                              -84.399746,
                              32.4494815
                          ],
                          [
                              -84.399745,
                              32.4495275
                          ],
                          [
                              -84.3997435,
                              32.449573
                          ],
                          [
                              -84.399742,
                              32.4496175
                          ],
                          [
                              -84.399742,
                              32.44966
                          ],
                          [
                              -84.3997435,
                              32.449701
                          ],
                          [
                              -84.3997475,
                              32.4497405
                          ],
                          [
                              -84.399754,
                              32.44978
                          ],
                          [
                              -84.3997635,
                              32.4498205
                          ],
                          [
                              -84.3997745,
                              32.449862
                          ],
                          [
                              -84.399787,
                              32.449903
                          ],
                          [
                              -84.3998015,
                              32.4499435
                          ],
                          [
                              -84.399817,
                              32.4499835
                          ],
                          [
                              -84.3998345,
                              32.4500225
                          ],
                          [
                              -84.3998535,
                              32.4500605
                          ],
                          [
                              -84.399874,
                              32.450097
                          ],
                          [
                              -84.3998895,
                              32.450121
                          ],
                          [
                              -84.3998965,
                              32.4501325
                          ],
                          [
                              -84.3999215,
                              32.450168
                          ],
                          [
                              -84.399949,
                              32.4502035
                          ],
                          [
                              -84.3999775,
                              32.450239
                          ],
                          [
                              -84.400008,
                              32.450275
                          ],
                          [
                              -84.400039,
                              32.4503115
                          ],
                          [
                              -84.400071,
                              32.450349
                          ],
                          [
                              -84.4001025,
                              32.4503865
                          ],
                          [
                              -84.4001325,
                              32.4504225
                          ],
                          [
                              -84.4001625,
                              32.4504575
                          ],
                          [
                              -84.400194,
                              32.4504925
                          ],
                          [
                              -84.4002265,
                              32.4505285
                          ],
                          [
                              -84.4002595,
                              32.450565
                          ],
                          [
                              -84.400293,
                              32.4506025
                          ],
                          [
                              -84.4003255,
                              32.450641
                          ],
                          [
                              -84.4003555,
                              32.4506785
                          ],
                          [
                              -84.4003575,
                              32.4506815
                          ],
                          [
                              -84.400387,
                              32.4507215
                          ],
                          [
                              -84.4004145,
                              32.450761
                          ],
                          [
                              -84.4004415,
                              32.450801
                          ],
                          [
                              -84.400468,
                              32.450841
                          ],
                          [
                              -84.4004935,
                              32.450881
                          ],
                          [
                              -84.400519,
                              32.4509215
                          ],
                          [
                              -84.4005445,
                              32.450962
                          ],
                          [
                              -84.400569,
                              32.4510025
                          ],
                          [
                              -84.4005935,
                              32.451043
                          ],
                          [
                              -84.400618,
                              32.4510835
                          ],
                          [
                              -84.400642,
                              32.451124
                          ],
                          [
                              -84.400666,
                              32.4511645
                          ],
                          [
                              -84.4006895,
                              32.451205
                          ],
                          [
                              -84.4007135,
                              32.4512455
                          ],
                          [
                              -84.400737,
                              32.4512855
                          ],
                          [
                              -84.4007405,
                              32.4512925
                          ],
                          [
                              -84.40076,
                              32.451334
                          ],
                          [
                              -84.4007645,
                              32.451346
                          ],
                          [
                              -84.400777,
                              32.4513895
                          ],
                          [
                              -84.400935,
                              32.4518515
                          ],
                          [
                              -84.4009375,
                              32.4518605
                          ],
                          [
                              -84.4009545,
                              32.4519415
                          ],
                          [
                              -84.4011715,
                              32.45295
                          ],
                          [
                              -84.401228,
                              32.453193
                          ],
                          [
                              -84.4013615,
                              32.4534335
                          ],
                          [
                              -84.401496,
                              32.4536075
                          ],
                          [
                              -84.40191,
                              32.4539755
                          ],
                          [
                              -84.4027385,
                              32.45467
                          ],
                          [
                              -84.403354,
                              32.455218
                          ],
                          [
                              -84.403367,
                              32.455232
                          ],
                          [
                              -84.4036885,
                              32.4556635
                          ],
                          [
                              -84.404536,
                              32.4568725
                          ],
                          [
                              -84.4045415,
                              32.456881
                          ],
                          [
                              -84.4045445,
                              32.456887
                          ],
                          [
                              -84.404875,
                              32.457492
                          ]
                      ]
                  ],
                  [
                      [
                          [
                              -84.3982155,
                              32.4518875
                          ],
                          [
                              -84.3891635,
                              32.451904
                          ],
                          [
                              -84.389026,
                              32.4591665
                          ],
                          [
                              -84.3890425,
                              32.459393
                          ],
                          [
                              -84.398222,
                              32.459268
                          ],
                          [
                              -84.398227,
                              32.458885
                          ],
                          [
                              -84.3982275,
                              32.458885
                          ],
                          [
                              -84.405306,
                              32.458691
                          ],
                          [
                              -84.4050405,
                              32.4582315
                          ],
                          [
                              -84.4043495,
                              32.456961
                          ],
                          [
                              -84.404322,
                              32.456922
                          ],
                          [
                              -84.4035055,
                              32.4557575
                          ],
                          [
                              -84.403192,
                              32.4553365
                          ],
                          [
                              -84.4031515,
                              32.4553005
                          ],
                          [
                              -84.4015995,
                              32.4551185
                          ],
                          [
                              -84.4002985,
                              32.453893
                          ],
                          [
                              -84.401696,
                              32.454048
                          ],
                          [
                              -84.4013345,
                              32.453727
                          ],
                          [
                              -84.4013225,
                              32.453714
                          ],
                          [
                              -84.4011785,
                              32.453528
                          ],
                          [
                              -84.401171,
                              32.4535165
                          ],
                          [
                              -84.401029,
                              32.45326
                          ],
                          [
                              -84.401021,
                              32.453239
                          ],
                          [
                              -84.4009615,
                              32.452983
                          ],
                          [
                              -84.400736,
                              32.451937
                          ],
                          [
                              -84.4007275,
                              32.4518975
                          ],
                          [
                              -84.400571,
                              32.4514385
                          ],
                          [
                              -84.40057,
                              32.4514345
                          ],
                          [
                              -84.4005585,
                              32.4513955
                          ],
                          [
                              -84.4005435,
                              32.451363
                          ],
                          [
                              -84.4005215,
                              32.451326
                          ],
                          [
                              -84.400498,
                              32.4512855
                          ],
                          [
                              -84.4004745,
                              32.4512455
                          ],
                          [
                              -84.400451,
                              32.4512055
                          ],
                          [
                              -84.400427,
                              32.4511655
                          ],
                          [
                              -84.400403,
                              32.451125
                          ],
                          [
                              -84.400379,
                              32.4510855
                          ],
                          [
                              -84.4003545,
                              32.451046
                          ],
                          [
                              -84.40033,
                              32.4510065
                          ],
                          [
                              -84.4003055,
                              32.4509675
                          ],
                          [
                              -84.4002805,
                              32.4509285
                          ],
                          [
                              -84.400255,
                              32.45089
                          ],
                          [
                              -84.400229,
                              32.4508515
                          ],
                          [
                              -84.400203,
                              32.4508145
                          ],
                          [
                              -84.400177,
                              32.4507785
                          ],
                          [
                              -84.4001495,
                              32.450744
                          ],
                          [
                              -84.40012,
                              32.450709
                          ],
                          [
                              -84.400089,
                              32.450674
                          ],
                          [
                              -84.400057,
                              32.450639
                          ],
                          [
                              -84.400024,
                              32.4506025
                          ],
                          [
                              -84.3999905,
                              32.4505655
                          ],
                          [
                              -84.399958,
                              32.4505275
                          ],
                          [
                              -84.3999275,
                              32.450491
                          ],
                          [
                              -84.399897,
                              32.4504545
                          ],
                          [
                              -84.399866,
                              32.450418
                          ],
                          [
                              -84.399834,
                              32.450381
                          ],
                          [
                              -84.399802,
                              32.4503425
                          ],
                          [
                              -84.39977,
                              32.4503035
                          ],
                          [
                              -84.399741,
                              32.4502655
                          ],
                          [
                              -84.399739,
                              32.4502625
                          ],
                          [
                              -84.399712,
                              32.4502245
                          ],
                          [
                              -84.3997095,
                              32.4502205
                          ],
                          [
                              -84.3996845,
                              32.4501815
                          ],
                          [
                              -84.399683,
                              32.450179
                          ],
                          [
                              -84.399682,
                              32.4501775
                          ],
                          [
                              -84.3996595,
                              32.450137
                          ],
                          [
                              -84.3996575,
                              32.4501335
                          ],
                          [
                              -84.3996365,
                              32.450092
                          ],
                          [
                              -84.399635,
                              32.4500885
                          ],
                          [
                              -84.3996165,
                              32.450046
                          ],
                          [
                              -84.399615,
                              32.450043
                          ],
                          [
                              -84.399598,
                              32.45
                          ],
                          [
                              -84.3995965,
                              32.449997
                          ],
                          [
                              -84.3995815,
                              32.449953
                          ],
                          [
                              -84.3995805,
                              32.44995
                          ],
                          [
                              -84.399567,
                              32.449906
                          ],
                          [
                              -84.399566,
                              32.4499035
                          ],
                          [
                              -84.3995545,
                              32.449859
                          ],
                          [
                              -84.3995535,
                              32.4498565
                          ],
                          [
                              -84.3995435,
                              32.449812
                          ],
                          [
                              -84.399543,
                              32.4498085
                          ],
                          [
                              -84.399535,
                              32.4497645
                          ],
                          [
                              -84.3995345,
                              32.4497585
                          ],
                          [
                              -84.39953,
                              32.4497135
                          ],
                          [
                              -84.3995295,
                              32.449709
                          ],
                          [
                              -84.399528,
                              32.449664
                          ],
                          [
                              -84.399528,
                              32.449661
                          ],
                          [
                              -84.3995285,
                              32.449614
                          ],
                          [
                              -84.3995295,
                              32.449568
                          ],
                          [
                              -84.399531,
                              32.4495235
                          ],
                          [
                              -84.399532,
                              32.4494795
                          ],
                          [
                              -84.3995315,
                              32.4494355
                          ],
                          [
                              -84.399531,
                              32.44939
                          ],
                          [
                              -84.399531,
                              32.4493445
                          ],
                          [
                              -84.399531,
                              32.4492995
                          ],
                          [
                              -84.399531,
                              32.4492545
                          ],
                          [
                              -84.399531,
                              32.4492095
                          ],
                          [
                              -84.399531,
                              32.449165
                          ],
                          [
                              -84.3995305,
                              32.4491205
                          ],
                          [
                              -84.3995295,
                              32.4490765
                          ],
                          [
                              -84.399528,
                              32.449032
                          ],
                          [
                              -84.399526,
                              32.4489875
                          ],
                          [
                              -84.3995245,
                              32.448943
                          ],
                          [
                              -84.3995215,
                              32.4489
                          ],
                          [
                              -84.3995175,
                              32.448858
                          ],
                          [
                              -84.3995115,
                              32.448818
                          ],
                          [
                              -84.3995025,
                              32.448779
                          ],
                          [
                              -84.399491,
                              32.4487385
                          ],
                          [
                              -84.399478,
                              32.448698
                          ],
                          [
                              -84.399463,
                              32.4486595
                          ],
                          [
                              -84.399446,
                              32.448623
                          ],
                          [
                              -84.3994265,
                              32.448589
                          ],
                          [
                              -84.3994035,
                              32.448556
                          ],
                          [
                              -84.399377,
                              32.4485215
                          ],
                          [
                              -84.399348,
                              32.4484875
                          ],
                          [
                              -84.399318,
                              32.4484535
                          ],
                          [
                              -84.399286,
                              32.44842
                          ],
                          [
                              -84.399253,
                              32.4483865
                          ],
                          [
                              -84.3992185,
                              32.448353
                          ],
                          [
                              -84.399184,
                              32.4483195
                          ],
                          [
                              -84.3991485,
                              32.448286
                          ],
                          [
                              -84.3991135,
                              32.448253
                          ],
                          [
                              -84.3990785,
                              32.44822
                          ],
                          [
                              -84.3990425,
                              32.4481875
                          ],
                          [
                              -84.399007,
                              32.448155
                          ],
                          [
                              -84.3989705,
                              32.4481225
                          ],
                          [
                              -84.3989345,
                              32.44809
                          ],
                          [
                              -84.398898,
                              32.4480575
                          ],
                          [
                              -84.3988615,
                              32.4480255
                          ],
                          [
                              -84.3988245,
                              32.447993
                          ],
                          [
                              -84.3987875,
                              32.447961
                          ],
                          [
                              -84.3987505,
                              32.4479285
                          ],
                          [
                              -84.3987135,
                              32.447896
                          ],
                          [
                              -84.398676,
                              32.4478635
                          ],
                          [
                              -84.398639,
                              32.447831
                          ],
                          [
                              -84.398602,
                              32.4477985
                          ],
                          [
                              -84.3985645,
                              32.447766
                          ],
                          [
                              -84.398528,
                              32.447733
                          ],
                          [
                              -84.3983655,
                              32.447589
                          ],
                          [
                              -84.398308,
                              32.4475375
                          ],
                          [
                              -84.3982935,
                              32.4475265
                          ],
                          [
                              -84.3982155,
                              32.4518875
                          ]
                      ]
                  ]
              ]
          },
          "properties": {
              "headline": "William Woodall Farm Rd",
              "path": "/us/ga/taylor/rupert/4396",
              "fields": {
                  "ogc_fid": 4396,
                  "geoid": "13269",
                  "parcelnumb": "011    007",
                  "parcelnumb_no_formatting": "011007",
                  "account_number": "2748",
                  "alt_parcelnumb1": "2748",
                  "usecode": "J5",
                  "owner": "SURF ROAD ASSOCIATES LLC",
                  "mailadd": "P.O. Box 4446",
                  "mail_city": "ATLANTA",
                  "mail_state2": "GA",
                  "mail_zip": "30308",
                  "address": "WILLIAM WOODALL FARM RD",
                  "saddno": "0",
                  "saddstr": "WILLIAM WOODALL FARM",
                  "saddsttyp": "RD",
                  "original_address": "{\"address\":\"WILLIAM WOODALL FARM RD\",\"saddno\":\"0\",\"saddstr\":\"WILLIAM WOODALL FARM RD\"}",
                  "city": "rupert",
                  "county": "taylor",
                  "state2": "GA",
                  "szip": "31058",
                  "szip5": "31058",
                  "address_source": "county",
                  "legaldesc": "TY 17-5,5B TY 22,24",
                  "lot": "4",
                  "lat": "32.452419",
                  "lon": "-84.401753",
                  "qoz": "Yes",
                  "qoz_tract": "13269950300",
                  "census_tract": "13269950301",
                  "census_block": "132699503012108",
                  "census_blockgroup": "132699503012",
                  "census_zcta": "31058",
                  "ll_last_refresh": "2024-01-30",
                  "gisacre": 670.78,
                  "sqft": 29219177,
                  "ll_gisacre": 648.13238,
                  "ll_gissqft": 28233234,
                  "path": "/us/ga/taylor/rupert/4396",
                  "ll_stable_id": "address",
                  "ll_uuid": "6308d57c-8538-4a76-9f2b-44cca9d79a9c",
                  "ll_updated_at": "2024-04-08 03:28:08 -0400"
              },
              "context": {
                  "headline": "Rupert, GA",
                  "name": "Rupert, GA",
                  "path": "/us/ga/taylor/rupert",
                  "active": true
              },
              "ll_uuid": "6308d57c-8538-4a76-9f2b-44cca9d79a9c"
          },
          "id": 40001913
      }
  ],
  "selectedLand": {
      "type": "Feature",
      "geometry": {
          "type": "MultiPolygon",
          "coordinates": [
              [
                  [
                      [
                          -84.4110565,
                          32.4700515
                      ],
                      [
                          -84.4110815,
                          32.469329
                      ],
                      [
                          -84.409942,
                          32.4696275
                      ],
                      [
                          -84.408788,
                          32.469929
                      ],
                      [
                          -84.409224,
                          32.4710555
                      ],
                      [
                          -84.409225,
                          32.4710595
                      ],
                      [
                          -84.409494,
                          32.4718735
                      ],
                      [
                          -84.40959,
                          32.472163
                      ],
                      [
                          -84.410034,
                          32.4734395
                      ],
                      [
                          -84.410434,
                          32.4743715
                      ],
                      [
                          -84.410953,
                          32.4755225
                      ],
                      [
                          -84.411041,
                          32.471629
                      ],
                      [
                          -84.4110475,
                          32.4709655
                      ],
                      [
                          -84.4110565,
                          32.4700515
                      ]
                  ]
              ],
              [
                  [
                      [
                          -84.399793,
                          32.471391
                      ],
                      [
                          -84.3982985,
                          32.471366
                      ],
                      [
                          -84.3981715,
                          32.472454
                      ],
                      [
                          -84.3981615,
                          32.4760465
                      ],
                      [
                          -84.3985875,
                          32.4760605
                      ],
                      [
                          -84.3987555,
                          32.47549
                      ],
                      [
                          -84.398827,
                          32.475255
                      ],
                      [
                          -84.3988835,
                          32.475085
                      ],
                      [
                          -84.398884,
                          32.475078
                      ],
                      [
                          -84.3988865,
                          32.47507
                      ],
                      [
                          -84.399047,
                          32.47457
                      ],
                      [
                          -84.399166,
                          32.474206
                      ],
                      [
                          -84.3991675,
                          32.474202
                      ],
                      [
                          -84.3993415,
                          32.473749
                      ],
                      [
                          -84.399461,
                          32.4733785
                      ],
                      [
                          -84.399549,
                          32.473125
                      ],
                      [
                          -84.399619,
                          32.4728565
                      ],
                      [
                          -84.3996245,
                          32.472818
                      ],
                      [
                          -84.399651,
                          32.47264
                      ],
                      [
                          -84.399652,
                          32.472458
                      ],
                      [
                          -84.3996115,
                          32.4721585
                      ],
                      [
                          -84.3996115,
                          32.4721555
                      ],
                      [
                          -84.3995905,
                          32.4719395
                      ],
                      [
                          -84.39959,
                          32.471933
                      ],
                      [
                          -84.399587,
                          32.4717215
                      ],
                      [
                          -84.399588,
                          32.4717085
                      ],
                      [
                          -84.399609,
                          32.471574
                      ],
                      [
                          -84.39961,
                          32.4715665
                      ],
                      [
                          -84.399611,
                          32.471563
                      ],
                      [
                          -84.3996155,
                          32.4715475
                      ],
                      [
                          -84.3996235,
                          32.471533
                      ],
                      [
                          -84.399627,
                          32.471528
                      ],
                      [
                          -84.399684,
                          32.471456
                      ],
                      [
                          -84.3996905,
                          32.471448
                      ],
                      [
                          -84.399704,
                          32.471437
                      ],
                      [
                          -84.3997185,
                          32.4714285
                      ],
                      [
                          -84.399793,
                          32.471391
                      ]
                  ]
              ],
              [
                  [
                      [
                          -84.4090195,
                          32.47111
                      ],
                      [
                          -84.408552,
                          32.4699005
                      ],
                      [
                          -84.40788,
                          32.4699995
                      ],
                      [
                          -84.407876,
                          32.47
                      ],
                      [
                          -84.4074745,
                          32.4700455
                      ],
                      [
                          -84.4070055,
                          32.4700975
                      ],
                      [
                          -84.4069975,
                          32.470098
                      ],
                      [
                          -84.406604,
                          32.470117
                      ],
                      [
                          -84.4062795,
                          32.4701445
                      ],
                      [
                          -84.405994,
                          32.470173
                      ],
                      [
                          -84.405713,
                          32.470202
                      ],
                      [
                          -84.4053465,
                          32.470247
                      ],
                      [
                          -84.404862,
                          32.4703555
                      ],
                      [
                          -84.4044295,
                          32.470447
                      ],
                      [
                          -84.403677,
                          32.470589
                      ],
                      [
                          -84.403052,
                          32.4707145
                      ],
                      [
                          -84.4026765,
                          32.470791
                      ],
                      [
                          -84.402044,
                          32.4709575
                      ],
                      [
                          -84.4014955,
                          32.471108
                      ],
                      [
                          -84.4009965,
                          32.471244
                      ],
                      [
                          -84.4009925,
                          32.471245
                      ],
                      [
                          -84.400569,
                          32.4713445
                      ],
                      [
                          -84.4002295,
                          32.4714165
                      ],
                      [
                          -84.400005,
                          32.4714955
                      ],
                      [
                          -84.3998485,
                          32.471574
                      ],
                      [
                          -84.399819,
                          32.471611
                      ],
                      [
                          -84.399801,
                          32.471726
                      ],
                      [
                          -84.399804,
                          32.471928
                      ],
                      [
                          -84.3998245,
                          32.4721395
                      ],
                      [
                          -84.3998655,
                          32.472443
                      ],
                      [
                          -84.399866,
                          32.4724535
                      ],
                      [
                          -84.399865,
                          32.472646
                      ],
                      [
                          -84.3998645,
                          32.472657
                      ],
                      [
                          -84.3998335,
                          32.4728655
                      ],
                      [
                          -84.3998305,
                          32.4728835
                      ],
                      [
                          -84.399829,
                          32.4728915
                      ],
                      [
                          -84.3997575,
                          32.4731675
                      ],
                      [
                          -84.3997555,
                          32.4731735
                      ],
                      [
                          -84.399667,
                          32.4734285
                      ],
                      [
                          -84.3995475,
                          32.473799
                      ],
                      [
                          -84.399546,
                          32.473803
                      ],
                      [
                          -84.3993715,
                          32.4742565
                      ],
                      [
                          -84.3992535,
                          32.4746185
                      ],
                      [
                          -84.3990975,
                          32.475103
                      ],
                      [
                          -84.399097,
                          32.4751105
                      ],
                      [
                          -84.3990945,
                          32.4751195
                      ],
                      [
                          -84.3990335,
                          32.475303
                      ],
                      [
                          -84.398963,
                          32.475535
                      ],
                      [
                          -84.398804,
                          32.476076
                      ],
                      [
                          -84.4005525,
                          32.476153
                      ],
                      [
                          -84.4027285,
                          32.476248
                      ],
                      [
                          -84.410929,
                          32.4765875
                      ],
                      [
                          -84.410942,
                          32.4760065
                      ],
                      [
                          -84.410233,
                          32.4744345
                      ],
                      [
                          -84.409832,
                          32.473499
                      ],
                      [
                          -84.40983,
                          32.4734935
                      ],
                      [
                          -84.409384,
                          32.4722125
                      ],
                      [
                          -84.409285,
                          32.4719135
                      ],
                      [
                          -84.4090195,
                          32.47111
                      ]
                  ]
              ]
          ]
      },
      "properties": {
          "headline": "William Woodall Farm Rd",
          "path": "/us/ga/taylor/rupert/612",
          "fields": {
              "ogc_fid": 612,
              "geoid": "13269",
              "parcelnumb": "010    015",
              "parcelnumb_no_formatting": "010015",
              "account_number": "2752",
              "alt_parcelnumb1": "2752",
              "usecode": "J5",
              "owner": "SURF ROAD ASSOCIATES LLC",
              "mailadd": "P.O. Box 4446",
              "mail_city": "ATLANTA",
              "mail_state2": "GA",
              "mail_zip": "30308",
              "address": "WILLIAM WOODALL FARM RD",
              "saddno": "0",
              "saddstr": "WILLIAM WOODALL FARM",
              "saddsttyp": "RD",
              "original_address": "{\"address\":\"WILLIAM WOODALL FARM RD\",\"saddno\":\"0\",\"saddstr\":\"WILLIAM WOODALL FARM RD\"}",
              "city": "rupert",
              "county": "taylor",
              "state2": "GA",
              "szip": "31058",
              "szip5": "31058",
              "address_source": "county",
              "legaldesc": "TY 17-4 (188.30 AC,",
              "lot": "6",
              "lat": "32.473378",
              "lon": "-84.405086",
              "qoz": "Yes",
              "qoz_tract": "13269950300",
              "census_tract": "13269950301",
              "census_block": "132699503012054",
              "census_blockgroup": "132699503012",
              "census_zcta": "31058",
              "ll_last_refresh": "2024-01-30",
              "gisacre": 188.3,
              "sqft": 8202348,
              "ll_gisacre": 186.38461,
              "ll_gissqft": 8119082,
              "path": "/us/ga/taylor/rupert/612",
              "ll_stable_id": "address",
              "ll_uuid": "98ca5cac-0c33-4cbd-b0e6-dd98857f93aa",
              "ll_updated_at": "2024-04-08 03:28:08 -0400"
          },
          "context": {
              "headline": "Rupert, GA",
              "name": "Rupert, GA",
              "path": "/us/ga/taylor/rupert",
              "active": true
          },
          "ll_uuid": "98ca5cac-0c33-4cbd-b0e6-dd98857f93aa"
      },
      "id": 40000268
  },
  "sellerType": null,
  "sellOptions": null
}

export const valueLandAtom = atom<{
  lands: null | IMap;
  selectedLand: null | IMap[0];
  calculatedPrice: IFindPropertyEstimatedPriceResponse | null;
  sellOptions: IAuthSliceInitial["selectedParcelOptions"] | null;
  sellerType: ISellProperty["sellerType"] | null;
  aboutLand: z.infer<typeof aboutLandSchema> | null;
}>({ lands: null, selectedLand: null, calculatedPrice: null, sellOptions: null, sellerType: null, aboutLand: null, ...testData });
