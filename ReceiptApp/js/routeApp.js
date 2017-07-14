$(function(){

var ApplicationRouter = Backbone.Router.extend({

		//map url routes to contained methods
		routes: {
			"": "listView",
			"listView": "listView",
			"createReceipt": "createReceipt",
			"updateReceipt": "updateReceipt"
		},

		hidePages: function(){
			//hide all pages with 'pages' class
			$('div.pages').hide(); 
		},

		showPage: function(page){
			//hide all pages
			this.hidePages();
			//show passed page by selector
			$(page).show();
		},

		listView: function() {
			this.showPage('div#listView-page');
			readReceipts();
		},

		createReceipt: function() {
			this.showPage('div#createReceipt-page');
			$("#createReceipt-page #createForm input[type='text']").val("");
			enableDatepicker("#createReceipt-page #createForm #datepicker1");
		},

		updateReceipt: function() {
			this.showPage('div#updateReceipt-page');
			$("#updateReceipt-page #updateForm input[type='text']").val("");
			enableDatepicker("#updateReceipt-page #updateForm  #datepicker1");

		}
	});

	var ApplicationView = Backbone.View.extend({
         
		//bind view to body element (all views should be bound to DOM elements)
		el: $('body'),

		//observe navigation click events and map to contained methods
		events: {
			'click #cancelBtn': 'listView',
			'click #list #createReceipt': 'createReceipt',
			'click #list .updateBtn': 'updateReceipt',
			'click #updateForm #saveBtn': 'updateRecord',
			'click #list .deleteBtn': 'deleteReceipt',
			'click .addItemBtn': 'addNewItemRow',
			'click .deleteItemRow': 'deleteItemRow',
			'keydown input.qty, input.price, input.footerCell': 'restrictNumbers',
			'keyup input.qty, input.price': 'computeTotal',
			'keyup input.footerCell': 'computeTaxDiscount'
		},

		//called on instantiation
		initialize: function(){
			//set dependency on ApplicationRouter
			this.router = new ApplicationRouter();

			//call to begin monitoring uri and route changes
			Backbone.history.start();
		},

		listView: function(){
			//update url and pass true to execute route method
			this.router.navigate("listView", true);
		},

		createReceipt: function(){
			//update url and pass true to execute route method
			this.router.navigate("createReceipt", true);			
		},
       
        updateReceipt: function(ev){
			//update url and pass true to execute route method
			this.router.navigate("updateReceipt", true);
			var obj = getReceiptId(ev);
			readReceiptById(obj["receiptid"]);
		},

		updateRecord: function(ev){
           var receiptid = $("#updateForm #receiptid").val();
           console.log(receiptid);
           updateReceipts(receiptid);
		},

		deleteReceipt: function(ev){
			if (confirm("Are you sure of deleting the receipt???") == true) {
				//deleteReceipts();
				var obj = getReceiptId(ev);				
				deleteReceipts(obj["receiptid"],obj["currRow"]);
			}
		},

		restrictNumbers: function(e){
				 // Allow: backspace, delete, tab, escape, enter and .
		    if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		         // Allow: Ctrl+A, Command+A
		        (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
		         // Allow: home, end, left, right, down, up
		        (e.keyCode >= 35 && e.keyCode <= 40)) {
		             // let it happen, don't do anything
		             return;
		    }
		    // Ensure that it is a number and stop the keypress
		    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		        e.preventDefault();
		    }
		},

		computeTaxDiscount: function(ev){
           var desc = getFormName(ev);
           formName = desc["formName"];
           var totSum = $(formName+" #subTotal").val()*(1+($(formName+" #tax").val()/100));
           var discount = $(formName+" #subTotal").val()*($(formName+" #discount").val()/100);
           $(formName+" #total").val(totSum-discount);
		},

		computeTotal: function(ev){
		   var desc = getFormName(ev);
		   var currRowCells = desc["currRow"].cells;
		   var qty = $(currRowCells[1]).find("input").val();
		   var price = $(currRowCells[2]).find("input").val();
		   var tot = qty*price;
		   $(currRowCells[3]).find("input").val(tot);
		   computeTotalAmt(desc["formName"]);
		},

		addNewItemRow: function(ev){
			var formName = "#"+$(ev.target.parentNode).attr("id");
			var newRowHtml = "<tr>" + $("table#itemGrid tr:nth-child(2)").html() + "</tr>";			
			$(formName+" #itemGrid").append(newRowHtml);
			$(formName+" #itemGrid .deleteItemRow").show();
		},

		deleteItemRow: function(ev){
		   var desc = getFormName(ev);
		   deleteRow(desc["currRow"],desc["formName"]);
		}

	});

	//load application
	new ApplicationView();

 function timeNow() {
  var d = new Date(),
      h = (d.getHours()<10?'0':'') + d.getHours(),
      m = (d.getMinutes()<10?'0':'') + d.getMinutes();
  return h + ':' + m;
}

function computeTotalAmt(formName){  
   var totSum = 0;
   $(formName+" .totPrice").each(function(){
     totSum += parseInt($(this).val());
   })
   
   if(!$.isNumeric(totSum)) totSum = 0;
   
   $(formName+" #subTotal").val(totSum);
   $(formName+" #total").val(totSum);
}

function deleteRow(currRow,formName){
  var rowCount = $(formName+" #itemGrid tr").length-1;
	   if(rowCount > 1)
	      $(currRow).remove();
	   else
	   	  $(formName+" #itemGrid .deleteItemRow").hide();

	   //update the sum
	   computeTotalAmt(formName);
}

function getFormName(ev){
	var currRow = ev.target.parentNode.parentNode;
	var formName = "#"+$(currRow.parentNode.parentNode.parentNode).attr("id");
	var desc = {"currRow": currRow, "formName": formName  };
	return desc;
}

function getReceiptId(ev){
  var currRow = ev.target.parentNode.parentNode;
  var receiptid = currRow.attributes["data-receiptid"].nodeValue;
  var receiptObj = {"currRow": currRow, "receiptid": receiptid};
  return receiptObj;
}

function enableDatepicker(cssSelector){
	$(cssSelector).datepicker({ dateFormat: 'M-dd-yy' });
	$(cssSelector).on("change",function(){
		var selected = $(this).val();
		var currTime = timeNow();
		$(this).val(selected+" "+currTime);
	});
}

});