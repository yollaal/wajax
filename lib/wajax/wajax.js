class wajax {
    constructor() {
        this.progress = 0;
    }

    async post(page, filter, data) {
        if (this.startFunction) {
            this.progress = 1;
            try {
                eval(this.startFunction + '();');
            } catch (err) {
                console.log(err, this.startFunction + " isimli function bulunamadı");
                this.progress = 0;
            }
        }

        let new_filter = {};
        if (typeof filter === "object" && filter !== null) {
            for (let key in filter) {
                if (filter.hasOwnProperty(key)) {
                    let val = filter[key];
                    if (Array.isArray(val)) {
                        let newObj = {};
                        for (let i in val) {
                            newObj[i] = val[i];
                        }
                        filter[key] = newObj;
                    }
                }
            }
        } else {
            filter = {};
        }

        let post_data = {};
        if (typeof data !== "object") data = {};

        let pages_array = page.split("/");
        post_data.page = pages_array[0];
        post_data.action = pages_array[1];

        let filter2 = {};
        pages_array.forEach((val, key) => {
            if (key >= 2) {
                let vals = val.split(':');
                filter2[vals[0]] = vals[1];
            }
        });

        post_data.filter = filter;
        post_data.filter2 = filter2;
        post_data.data = data;

        let __ajax = this;
        let self = this;

        // Convert post_data to URLSearchParams for application/x-www-form-urlencoded
        const buildFormData = (obj, parentKey = '') => {
            let params = new URLSearchParams();
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let paramKey = parentKey ? `${parentKey}[${key}]` : key;
                    if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                        let subParams = buildFormData(obj[key], paramKey);
                        for (let [k, v] of subParams.entries()) {
                            params.append(k, v);
                        }
                    } else if (Array.isArray(obj[key])) {
                        obj[key].forEach((val, idx) => {
                            if (typeof val === 'object' && val !== null) {
                                let subParams = buildFormData(val, `${paramKey}[${idx}]`);
                                for (let [k, v] of subParams.entries()) {
                                    params.append(k, v);
                                }
                            } else {
                                params.append(`${paramKey}[${idx}]`, val);
                            }
                        });
                    } else {
                        params.append(paramKey, obj[key]);
                    }
                }
            }
            return params;
        };

        try {
            const response = await fetch(this.post_page, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: buildFormData(post_data)
            });

            if (!response.ok) {
                throw new Error("Bağlantı Hatası:\n" + response.statusText);
            }

            const returnData = await response.json();

            try {
                if (returnData.status === false) {
                    alert(returnData.message);
                } else {
                    self.action(returnData);
                }
            } catch (err) {
                console.log('Hata Oluştu : ', err, returnData);
            }
        } catch (e) {
            alert(e.message);
        }

        window.setTimeout(() => {
            __ajax.updateEvent();
        }, 100);
    }

    exportTableToExcel(filename, tableExcel) {
        let dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
        if (navigator.msSaveOrOpenBlob) {
            let blob = new Blob([tableExcel], { type: dataType });
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.href = 'data:' + dataType + tableExcel;
            downloadLink.download = filename;
            downloadLink.click();
        }
    }

    action(data) {
        let thisw = this;
        if (typeof data.action === "object" && data.action !== null) {

            // Replaces $.each for objects
            const iterate = (obj, callback) => {
                if (typeof obj === 'object' && obj !== null) {
                    Object.keys(obj).forEach(key => {
                        callback(key, obj[key]);
                    });
                }
            };

            // Replaces DOM query and iteration
            const getElements = (selector) => document.querySelectorAll(selector);

            iterate(data.action, (key, $action) => {
                try {
                    if (typeof $action.excel === "object") {
                        iterate($action.excel, (key, arr) => {
                            try {
                                thisw.exportTableToExcel(arr.filename, arr.data);
                            } catch (err) { console.log({ 'type': 'console', 'key': key, 'error': err }); }
                        });
                    }

                    if (typeof $action.confirm === "object") {
                        iterate($action.confirm, (key, arr) => {
                            try {
                                let r = confirm(arr.message);
                                if (r === true) {
                                    eval(arr.script);
                                }
                            } catch (err) { console.log({ 'type': 'console', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.confirm_swall === "object") {
                        iterate($action.confirm_swall, (key, arr) => {
                            try {
                                if (typeof swal !== 'undefined') {
                                    swal({
                                        title: arr.title,
                                        text: (arr.message ? arr.message : "İşlemi Onaylıyormusunuz"),
                                        type: (arr.type ? arr.type : "warning"),
                                        showConfirmButton: true,
                                        showCancelButton: true,
                                        cancelButtonText: 'Hayır',
                                        cancelButtonColor: "#d33",
                                        confirmButtonText: "Evet",
                                        html: true
                                    }, function (isConfirm) {
                                        if (isConfirm) {
                                            eval(arr.script);
                                        }
                                    });
                                } else {
                                    console.warn("SweetAlert (swal) is not defined.");
                                }
                            } catch (err) { console.log({ 'type': 'console', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.console === "object") {
                        iterate($action.console, (key, arr) => {
                            try {
                                console.log(arr);
                            } catch (err) { console.log({ 'type': 'console', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.script === "object") {
                        iterate($action.script, (key, arr) => {
                            try {
                                eval(arr);
                            } catch (err) { console.log({ 'type': 'script', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.console_clear === "object") {
                        iterate($action.console_clear, (key, arr) => {
                            try {
                                console.clear();
                            } catch (err) { console.log({ 'type': 'script', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    // DOM Manipulations
                    if (typeof $action.assign === "object") {
                        iterate($action.assign, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.innerHTML = arr.content);
                            } catch (err) { console.log({ 'type': 'html', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.html === "object") {
                        iterate($action.html, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.innerHTML = arr.content);
                            } catch (err) { console.log({ 'type': 'html', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.val === "object") {
                        iterate($action.val, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.value = arr.content);
                            } catch (err) { console.log({ 'type': 'val', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.alert === "object") {
                        iterate($action.alert, (key, arr) => {
                            try {
                                alert(arr);
                            } catch (err) { console.log({ 'type': 'alert', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.remove === "object") {
                        iterate($action.remove, (key, arr) => {
                            try {
                                getElements(arr).forEach(el => el.remove());
                            } catch (err) { console.log({ 'type': 'remove', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.append === "object") {
                        iterate($action.append, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('beforeend', arr.content));
                            } catch (err) { console.log({ 'type': 'append', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.prepend === "object") {
                        iterate($action.prepend, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('afterbegin', arr.content));
                            } catch (err) { console.log({ 'type': 'prepend', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.before === "object") {
                        iterate($action.before, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('beforebegin', arr.content));
                            } catch (err) { console.log({ 'type': 'before', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.after === "object") {
                        iterate($action.after, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('afterend', arr.content));
                            } catch (err) { console.log({ 'type': 'after', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.insertAfter === "object") {
                        iterate($action.insertAfter, (key, arr) => {
                            try {
                                // Not typical to have content as a selector here in pure JS equivalent easily without parsing,
                                // but mimicking logic. Assuming arr.content is HTML string to insert after arr.tag.
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('afterend', arr.content));
                            } catch (err) { console.log({ 'type': 'insertAfter', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.insertBefore === "object") {
                        iterate($action.insertBefore, (key, arr) => {
                            try {
                                getElements(arr.tag).forEach(el => el.insertAdjacentHTML('beforebegin', arr.content));
                            } catch (err) { console.log({ 'type': 'insertBefore', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.redirect === "object") {
                        iterate($action.redirect, (key, arr) => {
                            try {
                                location.href = arr;
                            } catch (err) { console.log({ 'type': 'redirect', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                    if (typeof $action.sweat_alert === "object") {
                        iterate($action.alert, (key, arr) => { // This appears to be a bug in original code, using $action.alert here. Kept behavior.
                            try {
                                alert(arr);
                            } catch (err) { console.log({ 'type': 'alert', 'key': key, 'data': arr, 'error': err }); }
                        });
                    }

                } catch (err) {
                    console.log({
                        'type': 'main',
                        'key': key,
                        'data': $action,
                        'error': err
                    });
                }
            });
        }
    }

    set_button() {
        let ajax = this;
        let buttons = document.querySelectorAll('[w-click]:not([wclickok])');

        buttons.forEach(button => {
            button.setAttribute('wclickok', '1');
            button.addEventListener('click', function(e) {
                let frm = button.closest('[w-form]');
                if (!frm) {
                    frm = button.closest('form');
                }

                let action = button.getAttribute('w-click');
                let formValues = {};

                if (frm) {
                    if (!frm.id) {
                        frm.id = ajax.rand(24);
                    }
                    formValues = ajax.getFormValues(frm.id);
                }

                ajax.post(action, formValues);
            });
        });
    }

    rand(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    run(path, startFunction, finalFunction) {
        this.post_page = path;
        this.startFunction = startFunction;
        this.finalFunction = finalFunction;
        this.updateEvent();
    }

    updateEvent() {
        this.set_button();
        this.progress = 0;
        try {
            if (this.finalFunction) {
                eval(this.finalFunction + '();');
            }
        } catch (err) {
            console.log(err, this.finalFunction + " isimli function bulunamadı");
        }
    }

    getFormValues(parent, submitDisabledElements = false, prefix = '') {
        if (typeof parent === 'string') parent = document.getElementById(parent);
        let aFormValues = {};
        if (parent && parent.childNodes) {
            this._getFormValues(aFormValues, parent.childNodes, submitDisabledElements, prefix);
        }
        return aFormValues;
    }

    _getFormValues(aFormValues, children, submitDisabledElements, prefix) {
        const iLen = children.length;
        for (let i = 0; i < iLen; ++i) {
            let child = children[i];
            if (child.childNodes !== undefined) {
                this._getFormValues(aFormValues, child.childNodes, submitDisabledElements, prefix);
            }
            this._getFormValue(aFormValues, child, submitDisabledElements, prefix);
        }
    }

    _getFormValue(aFormValues, child, submitDisabledElements, prefix) {
        if (!child.name) return;
        if (child.disabled && !submitDisabledElements) return;
        if (prefix && child.name.substring(0, prefix.length) !== prefix) return;
        if (child.type && (child.type === 'radio' || child.type === 'checkbox') && !child.checked) return;

        let name = child.name;
        let values = [];

        if (child.type === 'select-multiple') {
            const jLen = child.length;
            for (let j = 0; j < jLen; ++j) {
                let option = child.options[j];
                if (option.selected) values.push(option.value);
            }
        } else {
            values = child.value;
        }

        let keyBegin = name.indexOf('[');
        if (keyBegin >= 0) {
            let n = name;
            let k = n.substr(0, n.indexOf('['));
            let a = n.substr(n.indexOf('['));

            if (typeof aFormValues[k] === 'undefined') aFormValues[k] = [];
            let p = aFormValues;

            while (a.length !== 0) {
                let sa = a.substr(0, a.indexOf(']') + 1);
                let lk = k;
                let lp = p;
                a = a.substr(a.indexOf(']') + 1);
                p = p[k];
                k = sa.substr(1, sa.length - 2);

                if (k === '') {
                    if (child.type === 'select-multiple') {
                        k = lk;
                        p = lp;
                    } else {
                        // For arrays without keys e.g. name[]
                        let maxIndex = -1;
                        if (Array.isArray(p)) {
                           maxIndex = p.length - 1;
                        } else {
                           for (let key in p) {
                               if (!isNaN(key)) maxIndex = Math.max(maxIndex, parseInt(key));
                           }
                        }
                        k = maxIndex + 1;
                    }
                }

                if (typeof p[k] === 'undefined') {
                    p[k] = a.length === 0 ? values : [];
                }
            }
            if (typeof p !== 'undefined' && p !== null) {
                p[k] = values;
            }
        } else {
            aFormValues[name] = values;
        }
    }
}

const ajax = new wajax();
