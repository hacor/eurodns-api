/**
 * This function checks if a provided URL is correct
 *
 * @param   str         required    The URL string
 * @returns {boolean}               Whether the URL is valid or not
 */
exports.validUrl = function (str) {
    var pattern = new RegExp('^(https?:\/\/)?'+ // protocol
        '((([a-z\d]([a-z\d-]*[a-z\d])*)\.)+[a-z]{2,}|'+ // domain name
        '((\d{1,3}\.){3}\d{1,3}))'+ // OR ip (v4) address
        '(\:\d+)?(\/[-a-z\d%_.~+]*)*'+ // port and path
        '(\?[;&a-z\d%_.~+=-]*)?'+ // query string
        '(\#[-a-z\d_]*)?$','i'); // fragment locater
    if(!pattern.test(str)) {
        return false;
    } else {
        return true;
    }
}
