### Bamazon

## Bamazon Customer

In this node application, the user (customer) is able to see all items for sale in a MYSQL database shown below and purchase  items while updating the database:

![Alt text](images/showItems.png?raw=true "show Items")

The user then puts in the ID he/she wants to purchase and how many units to buy. It then tells the user how many units are left in the inventory.

![Alt text](images/purchase.png?raw=true "purchase")

## Bamazon Manager

In this node application, the user (manager) has the ability to view all products, view low inventory (items that have five or less units), add units to inventory of an existing product, and add completely new products to the database:

The user is prompted with a menu: 

![Alt text](images/manager_menu.png?raw=true "manager menu")

If the user chooses to view all products it displays the following:

![Alt text](images/showItem_Manager.png?raw=true "show Item Manager")

If the user chooses to view products with less than five units in the inventory, it displays the following: 

![Alt text](images/viewLow.png?raw=true "view low")

If the user chooses to add to the inventory it displays the following: 

![Alt text](images/addInventory.png?raw=true "add inventory")

If the user chooses to create a new product it displays the following: 

![Alt text](images/addNewProduct.png?raw=true "add new product")

## Bamazon Supervisor 

In this node application, the user (supervisor) utilizes a separate table called departments. Each row in this table has the department name and its overhead costs. Additionally, every time the customer app makes a purchase, a new column called product_sales has been added that adds the price to it for each purchase. 

This displays the supervisor menu:

![Alt text](images/supervisorMenu.png?raw=true "supervisor menu")

When the user selects product sales it calculates the total profits of each departments by summing up the product sales of similar departments and subtracting the overhead costs:

![Alt text](images/productSales.png?raw=true "product Sales")

The user can also choose to add a new department to the database:

![Alt text](images/addNewDepartment.png?raw=true "add new department")

## Languages and Frameworks Used
Javascript, Node, MySql, inquirer


