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

    listMenuItems();


  });

function listMenuItems() {
    inquirer.prompt([
    {
        type: "list",
        name: "menu",
        message: "Manager Options",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]

      }

    ]).then(function(inquirerResponse) {
        switch (inquirerResponse.menu) {
            case "View Products for Sale":
                viewProducts();
                break;
            case "View Low Inventory":
                viewLowInventory();
                break;
            case "Add to Inventory":
                addToInventory();
                break;
            case "Add New Product":
                addProduct();
                break;

        }
    })

}

function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
    console.log("--------- PRODUCTS -------");
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | PRICE: $" + res[i].price + " | IN STOCK: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    
    buyAgain();

    });

}

function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(err, res) {
        console.log("--------- LOW INVENTORY -------");
    for (var i = 0; i < res.length; i++) {
        console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | PRICE: $" + res[i].price + " | IN STOCK: " + res[i].stock_quantity);
    }
    console.log("-----------------------------------");
    buyAgain();

    });




}

function addToInventory() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("--------- AVAILABLE TO ADD -------");
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | PRICE: $" + res[i].price + " | IN STOCK: " + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        inquirer.prompt([
            {
                type: "input",
                name: "id",
                message: "To which product would you like to add inventory? (Insert product ID)",
                
        
              },
              {
                type: "input",
                name: "amount",
                message: "How many?",
                
              },
    
            ]).then(function(inquirerResponse) {
                
                var product = inquirerResponse.id;
                var amount = parseInt(inquirerResponse.amount);
              //  console.log(product);
              //  console.log(amount);
                var amountInStock;
    
                connection.query("SELECT * FROM products WHERE item_id="+product, function(err, res) {
                    //console.log(err);
                    amountInStock = res[0].stock_quantity;
                   // console.log(amountInStock);
                    //console.log(amount);

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                          {
                            stock_quantity: amountInStock + amount
                          },
                          {
                            item_id: product
                          }
                        ],
                        function(err, res) {
                            if(err) {
                                console.log(err);
                            }

                            connection.query("SELECT * FROM products WHERE item_id="+product, function(err, res) {
                                var updatedAmount = res[0].stock_quantity;
                                console.log("Your addition went through!")
                                console.log("Quantity of " + res[0].product_name + " In Stock: " + updatedAmount);
                                buyAgain();
                               
                            
                            });
                    });
    
                });
    
            })
        

    });


    


}

function addProduct() {

    inquirer.prompt([
        {
            type: "input",
            name: "product_name",
            message: "What product would you like to add to the inventory?",
            
          },
          {
            type: "input",
            name: "department_name",
            message: "What department is it in?",
            
          },
          {
            type: "input",
            name: "price",
            message: "What is the price?",
            
          },
          {
            type: "input",
            name: "stock_quantity",
            message: "How many do you want to add to the inventory?",
            
          }

        ]).then(function(inquirerResponse) {

            connection.query("INSERT INTO products SET ?",
            
                {
                    product_name : inquirerResponse.product_name,
                    department_name : inquirerResponse.department_name,
                    price : inquirerResponse.price,
                    stock_quantity : inquirerResponse.stock_quantity
                },
                function(err, res) {
                    console.log("You successfully added " + inquirerResponse.stock_quantity + " " + inquirerResponse.product_name + "'s to the inventory!")
                    buyAgain();
                }
            );

            

        });




}

var buyAgain = function() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: "buyAgain",
            message: "Would you like to go back to the menu?",
            
        }
        
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.buyAgain) {
            listMenuItems();
        } else {
            connection.end();
        }
    });
}