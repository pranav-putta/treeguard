# Inspiration
Over the last few years, we have become almost desensitized to forest fires and their impact on the environment. Over the last few months, our own country has experienced catastrophes, with California's forests burning so fast and hard, it turned the sky a hazy red for days. Forest fires are an incredibly difficult problem to solve because the fire grows uncontrollably fast. In just one hour of a fire burning, it can become almost impossible to stop, reaching almost 10 mph at its peak. The solution is to find the fire as quickly as possible or find high risk areas, and put out the fires before they get too big. Satellite imaging and thermal detection cameras have been employed, but the problem is that satellites don't have high periodicity and cameras don't have great accuracy. So, we decided to use a few IOT Arduino boards to solve the problem by deploying a fleet of nodes that can map the heat signature of a forest.

# What it does
Tree Guard is a solution to improve early detection of forest fires. It tracks the temperature, humidity, and carbon dioxide of various locations in a forest by deploying hundreds and thousands of nodes. This large network can work together to display areas of high temperatures and risks of fires, so that first responders know where to start immediately when a fire breaks out. Putting out the problem :)

# How we built it
We built two nodes, a transmitter and receiver to show a proof of concept. The transmitters is an ESP32 (arduino-like) board which collects data from two sensors, a temperature and humidity sensor (DHT11) and a carbon dioxide sensor (Arduino). Then, a special transmitter called LoRa transmits the data to the receiver. The receiver (also same type of board) takes this data, and connected to a WiFi endpoint, connects to Google Firebase and deploys the information to the server. Our website then gets a push notification through the Firebase Cloud Messaging system and updates the information in real-time. The ESP32 boards were coded in C++ and our website was coded using ReactJS and typescript. The backend firebase functions were also coded in javascript.

# LoRa Communication 
LoRa is a special type of radio signal which can travel extremely long distances without losing information. We tested our devices successfully at a range of 250 feet, but the estimated range for LoRa devices can go up to 5 km. This gives us huge potential in using this system in a forest.

# Challenges we ran into
Literally every single piece of this puzzle was a frustrating moment. We learned how primitive radio transmitters sent data to create a "synchronized handshake" between the transmitter and the receiver so that the two nodes would acknowledge each other's presence and send data back and forth. This synchronized system was incredibly to create. Another big issue was sending the information from LoRa as byte packets to json formatted data in the cloud. We had to resolve this problem by really digging deep into how C and C++ convert byte streams into formatted strings and then constructing json data that can be sent up to the cloud using an HTTP protocol.

The biggest issue, however, was creating a network that could propagate data from node to node and reach a receiver which could send the data to the cloud. We ended up choosing a breadth first search algorithm to flood fill the data to a receiver. This is definitely not the most efficient way to solve this problem, but we will hopefully make this better in the future.

# Accomplishments that we're proud of
Our transmitter and receiver connect at long distances!! We walked around the complex of North Avenue, switching floors and still getting the data that was being transmitted from the transmitter to the receiver. This was a milestone accomplishment consider that we were able to set up a transmission and conversion of primitive sensor data up to the cloud. Once the information was up to the cloud, it was like we were home free.

We also built a simulation system to help emulate what the final product in a forest deployed with hundreds of these nodes would look like.

# What we learned
We learned a tremendous amount about low level radio communication and how to propagate data through complex networks.

# What's next for TreeGuard
After having so much success with sending information through long distances, we're super excited to continue working on this project as we see the potential it has in resolving a real-world issue. We hope to improve on the current system we have, and then contact local fire departments to get feedback on how useful such a system would be in the field, and build on our project from there!
