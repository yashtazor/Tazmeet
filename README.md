# Tazmeet

![Tazmeet Logo](https://user-images.githubusercontent.com/42903859/139480440-c9ba00bf-720f-4f95-a28d-231d1fd60564.png)

Tazmeet is a fully-fledged video conferencing platform designed to cater from small to large-scale meetings or broadcasts.

## Features

* Handles at least 100 users in a single meeting.
* Works by generating unique meeting codes and allowing only people entering the correct code to enter the meeting.
* Offers different roles like Administrator, Panelists, and Audience for the meeting with different levels of control
  * **Administrator** - Is able to mute the audience and panelists (both video and audio), remove or add people, promote or demote users between different roles.  
  * **Panelists** - Is able to do everything except for having moderator controls like muting audio / video, promoting / demoting, etc.  
  * **Audience** - Is only able to listen and should be muted by default unless promoted to higher roles.
* Has common meeting features like toggling audio or video, raising hands, screen sharing, a question panel, and ending a call.

## Initial Setup

### 1. Firebase Setup

#### Setting up the private key.

* Go to the [Firebase Console](https://console.firebase.google.com) and create a new web project.
* Go to Project Settings &rarr; Service Accounts &rarr; Generate Private Key.
* Create a **`secret`** folder inside **`web`** folder.
* Store the Private Key file inside the secret folder.
* Set the proper paths in Server.php, Client.php, Audience.php, and question.php.

#### Setting up the configuration information.

* In the Firebase Console, go to Project Settings &rarr; General.
* Copy the Firebase Configuration information.
* Paste it in Moderator.php, SeverJS.js, ClientJS.js, and AudienceJS.js in the commented areas.

### 2. Vonage Video API Setup

* Go to [Vonage Video API Website](https://id.tokbox.com/login) and create an account.
* Create a New Project &rarr; Vonage Video API.
* Get the API and Secret Keys.
* Paste these in Server.php, Client.php, Audience.php, and removeUser.php in the commented areas.

## How to run?

* Fire up the localhost using WAMP or XAMPP servers.
* Go to the Moderator page and create a meeting and generate the meeting code.
* Share the code with the joinees.
* Go to the Client page and choose the role to join with.
* Join the meeting by entering the correct meeting code.

<b> <p align = "center"> Created by Yash Dekate. </p> </b>
