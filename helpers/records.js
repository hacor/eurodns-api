/**
 * A record object
 * See https://agent.tryout-eurodns.com/documentation/http/zone/create/ for more info
 *
 * record.type      Required    String      (SOA, NS, PTR, MX, A, CNAME, AAAA, TXT, APEX, CAA)
 * record.host      Required    String      Record host @, *, www, mail
 * record.data      Required    String      The IP address, a mail field for MX records,...
 * record.ttl       R/O         Number      How long to cache records retrieved from the zone file (600, 900, 1800, 3600, 7200, 14400, 21600, 43200, 86400, 172800, 432000, 604800)
 * record.priority  R/O         Number      If record type is MX, priority of the MX record (10, 20, 30, 40, 50, 60, 70, 80, 90, 100)
 * record.refresh   R/O         Number      If record type is SOA, how often secondary DNS servers should check if changes are made to the zone
 * record.retry     R/O         Number      If record type is SOA.
 * record.expire    R/O         Number      If record type is SOA, how long the zone will be valid after a refresh.
 * record.minimum   R/O         Number      If record type is SOA, used as the default TTL for new records created within the zone.
 * record.serial    R/O         Number      If record type is SOA, used by secondary DNS servers to check if the zone has changed
 * record.respPerson   R/O      String      If record type is SOA, specifies the domain mailbox name for a responsible person
 * record.weight    R/O         Number      If record type is SRV
 * record.port      R/O         Number      If record type is SRV
 */

/**
 * Converts a record json object to XML
 *
 * @param record        Required    Object  A record object
 *
 */
module.exports.recordToXml = function (record) {
    const xml =
        `<record:type>${record.type ? record.type : ''}</record:type>
        <record:host>${record.host ? record.host : ''}</record:host>
        <record:data>${record.data ? record.data : ''}</record:data>
        ${record.ttl ? '<record:ttl>' + record.ttl + '</record:ttl>' : ''}
        ${record.priority ? '<record:mx_priority>' + record.priority + '</record:mx_priority>' : ''}
        ${record.refresh ? '<record:refresh>' + record.refresh + '</record:refresh>' : ''}
        ${record.retry ? '<record:retry>' + record.retry + '</record:retry>' :'' }
        ${record.expire ? '<record:expire>' + record.expire + '</record:expire>' : ''}
        ${record.minimum ? '<record:minimum>' + record.minimum + '</record:minimum>' : ''}
        ${record.serial ? '<record:serial>' + record.serial + '</record:serial>' : '' }
        ${record.respPersion ? '<record:resp_person>' + record.respPerson + '</record:resp_person>' : '' }
        ${record.weight ? '<record:weight>' + record.weight + '</record:weight>' : '' }
        ${record.port ? '<record:port>' + record.port  + '</record:port>' : ''}`

    return xml
}