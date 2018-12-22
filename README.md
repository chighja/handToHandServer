## Hand-To-Hand server

* **Data Types:**

  * **Match:**
  
  ```
    {
      "_id": "String",
      "nameChar1": "String",
      "voteChar1": "Number",
      "image1": "String",
      "nameChar2": "String",
      "voteChar2": "Number",
      "image2": "String"
    }
  ```

* **Routes:**
  
  * **GET to <_/votes_>**
  
    Response:
  
    ```Match[]```
  
  * **GET to <_/votes/:id_>**
  
    Response:
  
    ```Match```
  
  * **PATCH to <_/votes/:id_>**
  
    Request:
    ```
      {
        "voteChar1": "Number",
        "voteChar2": "Number"
      }
    ```
    Response:
  
    ```{ vote : Match }```
  
* **Success Response:**
  
  * **Code:** 200
    
* **Error Response:**
  
  * **Code:** 500

### Check it out!

You can view the front end application of ["Hand-To-Hand" here!](https://warm-inlet-87726.herokuapp.com/)

### Built with:

This project uses NodeJS, ExpressJS, MongooseJS, and MongoDB.
