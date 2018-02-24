# NAKY
NAKY is one of Kyeongho Na's indivisual project. The concept of project is a messaging service to help the school group projects.


## Concept
This basic web application functionality and configuration is similar to other messaging services but the goal is to specialize in features to help school projects. 
For example, Users can create a term contract when they initiate a project. Based on this, a system that enables evaluation based on the contribution of team members.  As these assessments remain personal records, the app encourage users to actively participate in group projects. 

## Current progress
So far, we have built a basic friend search function and chat system.
1.	Sign in system using google firebase auth
2.	Personal information record using MongoDB
3.	Use redis to quickly load chat history
4.	Real-time chat with Socket Io and connect status notification


## Feature Introduction
***Search & Add***

![Alt Text](http://www.naky.io/images/add.gif)

* I forgot that the real time notification update became real time when user add a friend. (I will fix it)


***Chat***

![Alt Text](http://www.naky.io/images/chat.gif)

## Details
* Angular Cli - frontend framework
* socket.io - real time cumunication between client and server
* mongoDB(mongoose) - primary DB
* firebase(firebaseAuth) - Autherntication
* redux(angular-redux/store) -for a single store and one-way data flow.
* rxjs - Mostly used for Observable and Promise
* express - HTTP for sever side 
* redis - chech chat data
* multer - updating user image 
* fs - save new image and delete old image (to save storage)