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
    displayMenu();



});

function displayMenu() {
    inquirer.prompt([
        {
            type: "list",
            name: "menu",
            message: "Supervisor Options",
            choices: ["View Product Sales by Department", "Create New Department"]
        }
    ]).then(function(inquirerResponse) {
        if(inquirerResponse.menu === "View Product Sales by Department") {
            viewProductSales();
        } else {
            createNewDepartment();
        }

    })
}

function viewProductSales() {
    connection.query("SELECT departments.department_id, departments.department_name, departments.over_head_costs, COALESCE(SUM(products.product_sales), 0) FROM departments LEFT JOIN products ON products.department_name = departments.department_name GROUP BY department_id ORDER BY department_id ASC",
        function(err, res) {
            

        console.log("--------- BAMAZON SUPERVISOR -------");
        for (var i = 0; i < res.length; i++) {
            var product_sales= res[i]["COALESCE(SUM(products.product_sales), 0)"];
            //console.log(product_sales)
            var total_profits = product_sales - res[i].over_head_costs;
            console.log("Department Name: " + res[i].department_name + " | " + "Over Head Costs: " + res[i].over_head_costs + " | " + "Product Sales: " + res[i]['COALESCE(SUM(products.product_sales), 0)'] + " | " + "Total Profit: " + total_profits);
    
        }  
        console.log("-----------------------------------");
        again();


    });

}

function createNewDepartment() {

     inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What department would you like to add to the inventory?",
            
          },
          {
            type: "input",
            name: "overhead",
            message: "What is the over head costs?"
          }
         
        ]).then(function(inquirerResponse) {

            connection.query("INSERT INTO departments SET ?",
            
                {
                    department_name : inquirerResponse.department_name,
                    over_head_costs : inquirerResponse.overhead
                },
                function(err, res) {
                    console.log("You successfully added the " + inquirerResponse.department_name + " department to your database and its overhead cost is: " + inquirerResponse.overhead);
                    again();
                }
            );

            

        });
}

var again = function() {
    inquirer.prompt([
        {
            type: 'confirm',
            name: "menu",
            message: "Would you like to return to the menu?"
            
        }
        
    ]).then(function(inquirerResponse) {
        if (inquirerResponse.menu) {
            displayMenu();
        } else {
            connection.end();
        }
    });
}