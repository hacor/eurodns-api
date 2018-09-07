# Models used in EuroDNS API
This page shows all the models which are reused throughout the project
## Record model

| Name              |   Required  | Type    | Description |
| ---               | ---         | ---     | ----------- |
| `record.id         `|   Optional  |  String   |   A unique identifier of the record
| `record.type       `|   Required  |  String   |   Type of the record (SOA, NS, PTR, MX, A, CNAME, AAAA, TXT, APEX, CAA, UrlForward, MailForward)
| `record.host       `|   Required  |  String   |   Record host @, *, www, mail
| `record.data       `|   Required  |  String   |   The IP address, a mail field for MX records,...
| `record.redirectionType` | R/O    |   String  |    http301, http302, frame ( urlForward )
| `record.newUrl     `|   R/O   |      String  |    New url of the record ( urlForward )
| `record.source     `|   R/O   |      String  |    Source of the record ( mailForward )
| `record.destination`|   R/O   |      String  |    Destination of the record ( mailForward )
| `record.ttl        `|   R/O   |      Number  |    How long to cache records retrieved from the zone file (600, 900, 1800, 3600, 7200, 14400, 21600, 43200, 86400, 172800, 432000, 604800)
| `record.priority   `|   R/O   |      Number  |    If record type is MX, priority of the MX record (10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
| `record.refresh    `|   R/O   |      Number  |    If record type is SOA, how often secondary DNS servers should check if changes are made to the zone
| `record.retry      `|   R/O   |      Number  |    If record type is SOA.
| `record.expire     `|   R/O   |      Number  |    If record type is SOA, how long the zone will be valid after a refresh.
| `record.minimum    `|   R/O   |      Number  |    If record type is SOA, used as the default TTL for new records created within the zone.
| `record.serial     `|   R/O   |      Number  |    If record type is SOA, used by secondary DNS servers to check if the zone has changed
| `record.respPerson `|   R/O   |      String  |    If record type is SOA, specifies the domain mailbox name for a responsible person
| `record.weight     `|   R/O   |      Number  |    If record type is SRV
| `record.port       `|   R/O   |      Number  |    If record type is SRV

## Contact model
|  Field                       | Type    |  Required   | Description |
| ---                          | ---     |  ---        | ---         |
| `contact.name        ` | String |     Required    |    The contact name
| `contact.type        ` | String |     Optional    |    Sometimes the contact type is a required field
| `contact.profileId   ` | String |     Optional    |    Sometimes you can provide a profileId, in this case all the further contact fields will be ignored
| `contact.firstName   ` | String |     Required    |    The contact owner first name
| `contact.lastName    ` | String |     Required    |    The contact owner last name
| `contact.company     ` | String |     Optional    |    The contact owner company name
| `contact.addressLine1` | String |     Required    |    The contact owner address line 1
| `contact.addressLine2` | String |     Optional    |    The contact owner address line 2
| `contact.addressLine3` | String |     Optional    |    The contact owner address line 3
| `contact.city        ` | String |     Required    |    The contact owner city name
| `contact.postalCode  ` | String |     Required    |    The contact owner city postal/zip code
| `contact.countryCode ` | String |     Required    |    The contact owner country code
| `contact.email       ` | String |     Required    |    The contact owner email
| `contact.phone       ` | String |     Required    |    The contact owner phone number. Phone number format: +999999999
| `contact.fax         ` | String |     Optional    |    The contact owner fax number. Fax number format: +999999999

## Nameserver model
| Field                         | Type  |   Required    |   Description |
| ---                           | ---   |   ---         | ---           |
|  `nameservers.priority`         | Number | Required   | The priority of this nameserver  |
|  `nameservers.fqdn    `         | String | Required   | The FQDN of the nameserver  |
|  `nameservers.ip      `         | String | Required   | The IP address of the nameserver  |