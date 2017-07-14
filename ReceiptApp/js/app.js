function getReceipt(formName){
    var itemListObj = {}, arr=[];
    $(formName+" #itemGrid tr:not(:first-child)").each(function(i){
        arr = [];
        $(this).find("td:not(:last-child)").each(function(){
            arr.push($(this).find("input").val());
        })
        itemListObj["item"+(i+1)] = arr;
    })
    var receipt = new Receipt({ receiptid: $(formName+" #receiptid").val(),
                                issuedBy: $(formName+" #issuedBy").val(),
                                issuedOn: $(formName+" #datepicker1").val(),
                                itemList: JSON.stringify(itemListObj),
                                subTotal: $(formName+" #subTotal").val(),
                                tax: $(formName+" #tax").val(),
                                discount: $(formName+" #discount").val(),
                                total: $(formName+" #total").val()
                             });
    return receipt;
}

function addReceipt() {
    // Lets perform a create operation [CREATE]
    var receipt = getReceipt("#createForm");
    receipt.save(null, {
    dataType:"text",
    success: function (model, respose, options) {
        console.log("The model has been saved to the server");
        alert("Receipt created successfully");
    },
    error: function (model, xhr, options) {
        console.log("Something went wrong while saving the model");
    }
});
}

function readReceipts() {
    // Now let us try to retrieve a Receipt [READ]
    var Receipt1 = new Receipt();
    Receipt1.fetch({
    success: function (response) {
        console.log(response.attributes);
        var trHTML = "";

         $.each(response.attributes, function (i, item) { 
          if(typeof item == 'object') {

                trHTML += '<tr class="receiptView" data-receiptid='+item["receiptId"]+'> <td class="logo" style="position:relative; left: 40px; width: 100px"> <img src="img/receipt.png" width="50"> </td> <td class="gridCell" style="width:48%">' + item["issuedBy"] + '<br/> ' + item["issuedOn"] + '</td> \
                           <td class="gridCell">' + item["total"] + '<img src="http://i.stack.imgur.com/nGbfO.png" width="8" height="10"> </td> \
                           <td style="position:absolute; right: 20px; padding-top: 2%"> <img src="img/update.png" class="updateBtn" width="20"> <img src="img/delete.png" class="deleteBtn" width="20"></td></tr>';
          }
           
         });

        $('#receiptGrid').empty().append(trHTML);
    }
    });
}

function deleteReceipts(receiptId, currRow) {
    // Let us delete the model with id 13 [DELETE]
    var Receipt2 = new Receipt({ receiptid: receiptId });
    Receipt2.destroy({
        success: function (model, respose, options) {
        $(currRow).remove();
    },
    error: function (model, xhr, options) {
    console.log("Something went wrong while deleting the model");
    }
    });
}

function readReceiptById(receiptid){
    var Receipt1 = new Receipt({ receiptid: receiptid });
    Receipt1.fetch({
    success: function (response) {
        var receiptDesc = response.attributes[0];
        console.log(receiptDesc);
        var listItem = JSON.parse(receiptDesc["itemList"]);
        var count = 0;
        for(item in listItem){
            $("#updateForm .addItemBtn").click();
        }        
        $("#updateForm .deleteItemRow").click();
        $("#updateForm #itemGrid tr:not(:first-child)").each(function(i){
            var idx = "item"+(i+1);
           $(this).find("td:first-child input").val(listItem[idx][0]);
           $(this).find("td:nth-child(2) input").val(listItem[idx][1]);
           $(this).find("td:nth-child(3) input").val(listItem[idx][2]);
           $(this).find("td:nth-child(4) input").val(listItem[idx][3]);
        });
        $("#updateForm input#receiptid").val(receiptDesc["receiptId"]);
        $("#updateForm input#issuedBy").val(receiptDesc["issuedBy"]);
        $("#updateForm #datepicker1").val(receiptDesc["issuedOn"]);
        $("#updateForm #subTotal").val(receiptDesc["subTotal"]);
        $("#updateForm #tax").val(receiptDesc["tax"]);
        $("#updateForm #discount").val(receiptDesc["discount"]);
        $("#updateForm #total").val(receiptDesc["total"]);
    }
    })
}

function updateReceipts(receiptId) {
    var receipt = getReceipt("#updateForm");
    console.log("updatig", receipt);
    receipt.save(null, {
        dataType:"text",
        success: function (model, respose, options) {
        console.log("The model has been updated to the server");
    },
    error: function (model, xhr, options) {
    console.log("Something went wrong while updating the model");
    }
    });
}