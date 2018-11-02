var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "password",
    database: "bamazon"
  });
  
  connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");
    displayProducts();



  });

  function displayProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
    console.log("--------- BAMAZON CUSTOMER -------");
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | PRICE: $" + res[i].price + " | IN STOCK: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");

    afterDisplay();

    });


  }

  function afterDisplay() {

    inquirer.prompt([
        {
            type: 'input',
            name: "idToBuy",
            message: "Which product ID would you like to purchase?",
            
        },
        {
            type: 'input',
            name: 'amount',
            message: "How many units would you like to purchase?"
        }

    ]).then(function(inquirerResponse) {
        var id = inquirerResponse.idToBuy.trim();
        var amountToBuy = parseInt(inquirerResponse.amount);

        connection.query("SELECT * FROM products WHERE item_id="+id, function(err, res) {
            var amountInStock = res[0].stock_quantity;
            var currentProductSales = res[0].product_sales;
            var totalPrice = res[0].price * amountToBuy;

            if(amountInStock < amountToBuy) {
                console.log("There is not enough product in stock to fulfill your purchase. Please try again");

                buyAgain();
                

            } else {
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                      {
                        stock_quantity: amountInStock - amountToBuy,
                        product_sales: currentProductSales + totalPrice
                      },
                      {
                        item_id: id
                      }
                    ],
                    function(err, res) {
                        if(err) {
                            return console.log(err);
                        }

                        connection.query("SELECT * FROM products WHERE item_id="+id, function(err, res) {
                            var updatedAmount = res[0].stock_quantity;
                            console.log("Your purchase went through!")
                            console.log("Total Price: " + totalPrice);
                            console.log("Quantity of " + res[0].product_name + " In Stock: " + updatedAmount);
                            buyAgain();
                        
                        });
                        
                        
                    }
                );  
            }
            
        });
        


    });

  }

var buyAgain = function() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: "buyAgain",
            message: "Would you like to make another purchase?",
            
        }
        
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.buyAgain) {
            displayProducts();
        } else {
            connection.end();
        }
    });
}


