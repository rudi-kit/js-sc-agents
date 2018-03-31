import {scKeynodes} from "./service/scKeynodes";
import {sctpClient} from "./service/sctpClient";
import {curryN, map} from "ramda";

async function _getSysIdtf(sctpClient, nrelSysIdtf, scAddr) {
    const triplesWithLink = await sctpClient.iterate_elements(SctpIteratorType.SCTP_ITERATOR_5F_A_A_A_F,
        [scAddr, sc_type_arc_common, sc_type_link, sc_type_arc_pos_const_perm, nrelSysIdtf]);
    if (triplesWithLink.length !== 1) return null;
    return sctpClient.get_link_content(triplesWithLink[0][2]);
}

/**
 * For array of sc-addr find it-s sys-id
 * @param sctpClient - sctpClient.js
 * @param scKeynodes - scKeynodes.js
 * @param scAddrs: [natural] - sys-ids
 */
async function getSysIdtf(sctpClient, scKeynodes, scAddrs) {
    const nrel_system_identifier = await scKeynodes.resolveKeynode('nrel_system_identifier');
    const sysItdfsPromises =  map(curryN(3,_getSysIdtf)(sctpClient, nrel_system_identifier),scAddrs);
    return Promise.all(sysItdfsPromises);
}

export const getSysIdtf = curryN(3, getSysIdtf)(sctpClient, scKeynodes);
