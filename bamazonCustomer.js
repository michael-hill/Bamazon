var mysql = require('mysql');
var inquirer = require('inquirer');
var Table = require('cli-table2');

var connection = mysql.createConnection({
	host: 'localhost',
	port: 3306,
	user: 'root',
	password: '8012dev',
	database: 'bamazon'
})
 
connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
 
  // console.log('connected as id ' + connection.threadId);
  console.log("Welcome Customer");
  showTable();
});

function showTable(){
	connection.query('SELECT * FROM products', function (error, results, fields){

		var table = new Table({
			head: ['ID', 'Product Name', 'Department', 'Price', 'Stock'],
			colWidths: [20,20,20,20,20]
		});

		for (var i = 0; i < results.length; i++) {
			table.push(
				[results[i].item_id, results[i].product_name, results[i].department_name, results[i].price , results[i].stock_quantity]
			);
		}

		console.log(table.toString());
		promptCustomer();
	}); 
}

function promptCustomer(){	
	inquirer
	   .prompt([{
	           type: "input",
	           message: "Choose product ID:",
	           name: "productid"
	       },
	       {
	           type: "input",
	           message: "Choose amount to purchase:",
	           name: "quantity"
	       }

	   ]).then(function(response){

	       connection.query( "SELECT * FROM products WHERE item_id=?", [response.productid], function(err,res){

	               for(i = 0; i < res.length; i++) {
	                   var quantity = res[i].stock_quantity;
	                   var price = res[i].price;
	               }

	               var total = quantity - response.quantity;

	                   if(total < 0) {
	                       console.log('insufficient stock!');
	                   }

	                   else {
	                       connection.query(
	                           "UPDATE products SET ? WHERE ?",

	                           [{stock_quantity:total},{id:response.productid}],

	                           function(err,res) {
	                           		var totalPrice = price * response.quantity;
	                           		console.log("Your totalPrice is " + "$"+totalPrice + " Thanks for your purchase!");
	                           }
	                       );
	                   }
	           }
	       );
	});

}
