<?php
require_once("dbcontroller.php");
/* 
A domain Class to demonstrate RESTful web services
*/
$mNew = new receipt(); 

switch($_GET['action']){
  case 'create' :  $mNew->createReceipt();
                    break;
  case 'read' :    $mNew->readReceipt();
                    break;
  case 'update' : $mNew->updateReceipt();
                   break;
  case 'delete' : $mNew->deleteReceipt();
                   break;
}

Class receipt {
	private $receipts = array();

	public function generateQuery($action){
       
		$params = json_decode(file_get_contents('php://input'),true);
		print_r($params);

		$dbcontroller = new DBController();
		$con = $dbcontroller->connectDB();

		if(isset($params['issuedBy'])) {  
			$issuedBy = mysqli_real_escape_string($con, $params['issuedBy']);
		}
		if(isset($params['issuedOn'])){
			$issuedOn = mysqli_real_escape_string($con, $params['issuedOn']);
		}
		if(isset($params['itemList'])){
			$itemList = mysqli_real_escape_string($con, $params['itemList']);
		}
		if(isset($params['subTotal'])){
			$subTotal = mysqli_real_escape_string($con, $params['subTotal']);
		}
		if(isset($params['tax'])){
            $tax = mysqli_real_escape_string($con, $params['tax']);
		}		
		if(isset($params['discount'])){
			$discount = mysqli_real_escape_string($con, $params['discount']);
		}
		if(isset($params['total'])){
			$total = mysqli_real_escape_string($con, $params['total']);
		}	

		if($action == 'insert'){
			$query = "insert into receiptlist (issuedBy,issuedOn,itemList,subTotal,Tax,Discount,Total) values ('$issuedBy','$issuedOn','$itemList','$subTotal','$tax','$discount','$total')";
		}	
		else{
			$query = "UPDATE receiptlist SET issuedBy= '".$issuedBy."',issuedOn= '".$issuedOn."',itemList='".$itemList."',subTotal='".$subTotal."',tax='".$tax."',discount= '". $discount ."',total='". $total ."' WHERE receiptId = ".$_GET['receiptid'];
		}	

		return $query;				
	}

    public function createReceipt(){		
			$dbcontroller = new DBController();
			$query = $this->generateQuery('insert');
			$result = $dbcontroller->executeQuery($query);
			if($result != 0){
				$result = array('success'=>1);
				return $result;
			}
	}

	public function readReceipt(){ 
		if(isset($_GET['receiptid']) && $_GET['receiptid'] != ''){      
			$receiptId = $_GET['receiptid']; 
			$query = 'SELECT * FROM receiptlist WHERE receiptId =' . $receiptId; 
		} else {
			$query = 'SELECT * FROM receiptlist';
		}
		$dbcontroller = new DBController(); 
		$this->receipts = $dbcontroller->executeSelectQuery($query);
		return $this->receipts; 
	}
    
    public function updateReceipt(){
		if(isset($_GET['receiptid'])){
			$query = $this->generateQuery('update');			
		}
		$dbcontroller = new DBController();
		$result= $dbcontroller->executeQuery($query);
		if($result != 0){
			$result = array('success'=>1);
			return $result;
		}
	}		
	
	public function deleteReceipt(){
		if(isset($_GET['receiptid'])){
			$receiptid = $_GET['receiptid'];
			$query = 'DELETE FROM receiptlist WHERE receiptid = '. $receiptid;
			$dbcontroller = new DBController();
			$result = $dbcontroller->executeQuery($query);
			if($result != 0){
				$result = array('success'=>1);
				return $result;
			}
		}
	}	
}
?>