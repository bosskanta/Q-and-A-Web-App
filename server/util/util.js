// check for blank string: true if it is, false if it is not
export let isBlank = str => (!str || /^\s*$/.test(str));

export let validatorEmail = value => {
    let rEmail = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
    return rEmail.test(value);
}

// formatting any logging error to object
export const logError = err => {
    let error = { errors: { global: {} } };

    if (typeof err === 'object') {
        try {
            if (err.name)
                if (err.name === 'MongoError')
                    error.errors['global'] = `${err.errmsg.slice(0, err.errmsg.indexOf(':'))} ${JSON.stringify(err.keyValue, '\"', 1)}`;
                else
                    error.errors['global'] = err.message;
            else {
                let msgs = [];
                Object.keys(err.errors).map(e =>
                    error.errors.global[e] = err.errors[e].message
                )
            }
        } catch (err) {
            return error.errors['global'] = "Error: unknown reason";
        }
    }
    else if (typeof err === 'string')
        error.errors['global'] = err;
    else
        error.errors['global'] = "Error: unknown reason";

    return error;
};