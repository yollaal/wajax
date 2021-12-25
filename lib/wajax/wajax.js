
class wajax {

    constructor() {
        this.progress=0;
    }
    async post (page,filter,data){

        if(this.startFunction){
            this.progress=1;
            try {
                eval(this.startFunction+'();')

            }
            catch (err) {
                console.log(err,this.startFunction+" isimli function bulunamadı");
                this.progress=0;

            }
        }

        var new_filter ={};
        $.each(filter,function(key,val){
            if(Array.isArray(val)){
                var newObj = {};
                for (let i in val){
                    newObj[i] = val[i];
                }
                filter[key] = newObj;
            }
        });


        var post_data = {};

        if(typeof filter != "object" || filter  == undefined || filter.length<=0)   filter = {};

        if(typeof data != "object")   data = {};
        var pages_array = page.split("/");

        post_data.page=pages_array[0];
        post_data.action=pages_array[1];

        var filter2={};

        $.each(pages_array,function(key,val){
            if(key>=2){
                var vals = val.split(':');
                filter2[vals[0]]= vals[1];
            }
        });


        post_data.filter = filter;
        post_data.filter2 = filter2;
        post_data.data =data;




        var __ajax = this;

        var self = this;
        var res = await  $.ajax({
            type: "POST",
            url: this.post_page,
            data: post_data,
            dataType: "json",
            success: function (returnData) {
                
                try {
                    if(returnData.status==false){
                        alert(returnData.message);
                    } else{
                        self.action(returnData);
                    }
                }
                catch (err) {
                    console.log('Hata Oluştu : ' , err , returnData );
                }
            },
            error: function (e) {
                alert("Bağlantı Hatası:\n"+e.responseText);
            }
        });


        window.setTimeout(function(){
            __ajax.updateEvent();
            }, 100
        );
    }

    exportTableToExcel( filename, tableExcel) {
        let dataType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
        if (navigator.msSaveOrOpenBlob)
        {
            let blob = new Blob(
                [ tableExcel ],
                { type: dataType }
            );
            navigator.msSaveOrOpenBlob(blob, filename);
        } else {
            let downloadLink = document.createElement("a");
            document.body.appendChild(downloadLink);
            downloadLink.href = 'data:' + dataType + tableExcel;
            downloadLink.download = filename;
            downloadLink.click();
        }
    }

    action(data){
        var thisw = this;
        if(typeof data.action == "object"){

            $.each(data.action,function(key,$action){

                try {
                    if(typeof $action.excel == "object")
                        $.each($action.excel,function(key,arr){
                            try {
                                thisw.exportTableToExcel(arr.filename,arr.data);
                            }
                            catch (err) {console.log({'type':'console','key':key, 'error':err });}

                        });

                    if(typeof $action.confirm == "object")
                        $.each($action.confirm,function(key,arr){

                            try {

                                var r = confirm(arr.message);
                                if (r == true) {
                                    eval(arr.script);
                                }
                            }
                            catch (err) {console.log({'type':'console','key':key,'data':arr, 'error':err });}

                        });


                    if(typeof $action.confirm_swall == "object")
                        $.each($action.confirm_swall,function(key,arr){

                            try {
                                swal({
                                    title: arr.title,
                                    text: (arr.message?arr.message:"İşlemi Onaylıyormusunuz"),
                                    type:  (arr.type? arr.type:"warning"),
                                    showConfirmButton: true,
                                    showCancelButton: true,
                                    cancelButtonText: 'Hayır',
                                    cancelButtonColor: "#d33",
                                    confirmButtonText: "Evet",
                                    html: true
                                },function(isConfirm){
                                    if (isConfirm) {
                                        eval(arr.script);
                                    } else {

                                    }
                                });
                            }
                            catch (err) {console.log({'type':'console','key':key,'data':arr, 'error':err });}

                        });



                    if(typeof $action.console == "object")
                        $.each($action.console,function(key,arr){

                            try {
                                console.log(arr);
                            }
                            catch (err) {console.log({'type':'console','key':key,'data':arr, 'error':err });}

                        });


                    if(typeof $action.script == "object")
                        $.each($action.script,function(key,arr){

                            try {
                                eval(arr);
                            }
                            catch (err) {console.log({'type':'script','key':key,'data':arr, 'error':err });}

                        });


                    if(typeof $action.console_clear == "object")
                        $.each($action.console_clear,function(key,arr){

                            try {
                                console.clear();
                            }
                            catch (err) {console.log({'type':'script','key':key,'data':arr, 'error':err });}

                        });


                    if(typeof $action.assign == "object")
                        $.each($action.assign,function(key,arr){
                            try {
                                $(arr.tag).assign(arr.content)
                            }
                            catch (err) {console.log({'type':'html','key':key,'data':arr, 'error':err });}


                        });


                    if(typeof $action.html == "object")
                        $.each($action.html,function(key,arr){
                            try {
                                $(arr.tag).html(arr.content)
                            }
                            catch (err) {console.log({'type':'html','key':key,'data':arr, 'error':err });}

                        });

                    if(typeof $action.val == "object")
                        $.each($action.val,function(key,arr){
                            try {
                                $(arr.tag).val(arr.content)
                            }
                            catch (err) {console.log({'type':'val','key':key,'data':arr, 'error':err });}
                        });



                    if(typeof $action.alert == "object"){
                        $.each($action.alert,function(key,arr){

                            try {
                                alert(arr);
                            }
                            catch (err) {console.log({'type':'alert','key':key,'data':arr, 'error':err });}

                        });
                    }


                    if(typeof $action.remove == "object")
                        $.each($action.remove,function(key,arr){
                            try {
                                $(arr).remove();
                            }
                            catch (err) {console.log({'type':'remove','key':key,'data':arr, 'error':err });}

                        });


                    if(typeof $action.append == "object")
                        $.each($action.append,function(key,arr){

                            try {
                                $(arr.tag).append(arr.content)
                            }
                            catch (err) {console.log({'type':'append','key':key,'data':arr, 'error':err });}
                        });

                    if(typeof $action.prepend == "object")
                        $.each($action.prepend,function(key,arr){
                            try {
                                $(arr.tag).prepend(arr.content)
                            }
                            catch (err) {console.log({'type':'prepend','key':key,'data':arr, 'error':err });}
                        });

                    if(typeof $action.before == "object")
                        $.each($action.before,function(key,arr){
                            try {
                                $(arr.tag).before(arr.content);
                            }
                            catch (err) {console.log({'type':'before','key':key,'data':arr, 'error':err });}
                        });

                    if(typeof $action.after == "object")
                        $.each($action.after,function(key,arr){
                            try {
                                $(arr.tag).after(arr.content);
                            }
                            catch (err) {console.log({'type':'after','key':key,'data':arr, 'error':err });}

                        });

                    if(typeof $action.insertAfter == "object")
                        $.each($action.insertAfter,function(key,arr){

                            try {
                                $(arr.tag).insertAfter(arr.content)
                            }
                            catch (err) {console.log({'type':'insertAfter','key':key,'data':arr, 'error':err });}
                        });

                    if(typeof $action.insertBefore == "object")
                        $.each($action.insertBefore,function(key,arr){
                            try {
                                $(arr.tag).insertBefore(arr.content)
                            }
                            catch (err) {console.log({'type':'insertBefore','key':key,'data':arr, 'error':err });}
                        });


                    if(typeof $action.redirect == "object")
                        $.each($action.redirect,function(key,arr){
                            try {
                                location.href=arr
                            }
                            catch (err) {console.log({'type':'redirect','key':key,'data':arr, 'error':err });}
                        });

                    if(typeof $action.sweat_alert == "object"){
                        $.each($action.alert,function(key,arr){

                            try {
                                alert(arr);

                            }
                            catch (err) {console.log({'type':'alert','key':key,'data':arr, 'error':err });}

                        });
                    }

                }
                catch (err) {
                    console.log(
                        {
                            'type':'main',
                            'key':key,
                            'data':$action,
                            'error':err
                        }
                    );
                }
            });
        }
    }

    set_button(){

        let ajax =this;
        $.each($('[w-click]:not([wclickok])'),function(key,val){
            var  $this = $(this);
            $this.attr('wclickok',1);
            $this.click(function(index,value){
                let frm;
                frm =$this.parents('[w-form]');
                if(frm.length<=0){
                    frm =$this.parents('form')
                }
                let a =$this.attr('w-click');
                if(!frm.attr('id'))frm.attr('id',ajax.rand(24));
                ajax.post( a,  ajax.getFormValues(frm.attr('id')) );
            });
        });
    }


    rand(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }



    run(path , startFunction , finalFunction ){


        this.post_page = path;
        this.startFunction = startFunction;
        this.finalFunction = finalFunction;

        this.updateEvent();
    }


    updateEvent() {


        this.set_button();
        this.progress=0;
        try {
            eval(this.finalFunction+'();')
        }
        catch (err) {
            console.log(err,this.finalFunction+" isimli function bulunamadı");
        }
     }

    getFormValues__ = function (selector) {
        return $('#' + selector).serializeObject();
    }


    getFormValues = function (parent) {
        var submitDisabledElements = false;
        if (arguments.length > 1 && arguments[1] == true)submitDisabledElements = true;
        var prefix = '';
        if (arguments.length > 2)prefix = arguments[2];
        if ('string' == typeof parent)parent = document.getElementById(parent);
        var aFormValues = {};
        if (parent)if (parent.childNodes)this._getFormValues(aFormValues, parent.childNodes, submitDisabledElements, prefix);
        return aFormValues;
    }

    _getFormValues = function (aFormValues, children, submitDisabledElements, prefix) {
        var iLen = children.length;
        for (var i = 0; i < iLen; ++i) {
            var child = children[i];
            if ('undefined' != typeof child.childNodes)this._getFormValues(aFormValues, child.childNodes, submitDisabledElements, prefix);
            this._getFormValue(aFormValues, child, submitDisabledElements, prefix);
        }
    }

    _getFormValue = function (aFormValues, child, submitDisabledElements, prefix) {
        if (!child.name)return;
        if (child.disabled)if (true == child.disabled)if (false == submitDisabledElements)return;
        if (prefix != child.name.substring(0, prefix.length))return;
        if (child.type)if (child.type == 'radio' || child.type == 'checkbox')if (false == child.checked)return;
        var name = child.name;
        var values = [];
        if ('select-multiple' == child.type) {
            var jLen = child.length;
            for (var j = 0; j < jLen; ++j) {
                var option = child.options[j];
                if (true == option.selected)values.push(option.value);
            }
        } else {
            values = child.value;
        }
        var keyBegin = name.indexOf('[');
        if (0 <= keyBegin) {
            var n = name;
            var k = n.substr(0, n.indexOf('['));
            var a = n.substr(n.indexOf('['));
            if (typeof aFormValues[k] == 'undefined')aFormValues[k] = [];
            var p = aFormValues;
            while (a.length != 0) {
                var sa = a.substr(0, a.indexOf(']') + 1);
                var lk = k;
                var lp = p;
                a = a.substr(a.indexOf(']') + 1);
                p = p[k];
                k = sa.substr(1, sa.length - 2);
                if (k == '') {
                    if ('select-multiple' == child.type) {
                        k = lk;
                        p = lp;
                    } else {
                        k = p.length;
                    }
                }
                if (typeof p[k] == 'undefined')p[k] = [];
            }
            p[k] = values;
        } else {
            aFormValues[name] = values;
        }
    }

}



var ajax =  new wajax();




