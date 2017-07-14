var Receipt = Backbone.Model.extend({
    defaults: {
        receiptid: "",
        issuedBy: "",
        issuedOn: "",
        itemList: "",
        subTotal: "",
        tax: "",
        discount: "",
        total: "" 
    },
    idAttribute: "receiptid",
    // Lets create function which will return the custom URL based on the method type
    getCustomUrl: function (method) {
        var id = this.attributes.receiptid;
        if(method == 'update' && id == '')
            method = 'create';    
        switch (method) {            
            case 'create':
                return 'http://localhost/ReceiptApp/ReceiptCRUD.php?action=create';
                break;
            case 'read':
                return 'http://localhost/ReceiptApp/ReceiptCRUD.php?action=read&receiptid=' +id;
                break;
            case 'update':
                return 'http://localhost/ReceiptApp/ReceiptCRUD.php?action=update&receiptid=' + id;
                break;
            case 'delete':
                return 'http://localhost/ReceiptApp/ReceiptCRUD.php?action=delete&receiptid=' + id;
                break;
        }
    },

    
    // Now lets override the sync function to use our custom URLs
    sync: function (method, model, options) {
        options || (options = {});
        options.url = this.getCustomUrl(method.toLowerCase());
        // Lets notify backbone to use our URLs and do follow default course
        return Backbone.sync.apply(this, arguments);
    }
});