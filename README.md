📝 Todo App Built with the MEAN Stack

🚀 Setup

1. 🔧 Environment Configuration
   Duplicate the .env.example file and rename the copy to .env.
   Populate the .env file with the necessary configuration details.
2. 📦 Install Server Dependencies
   Navigate to the root directory and run:

npm install 3. 🏁 Start the Server
Launch the server by executing:

npm start
If successful, the console will display messages similar to:

Server started on http://localhost:3000
Db connected successfully. mongodb://localhost:27017/stackhackTodo
appUrl: Defined in the .env file (default is http://localhost).
appPort: Defined in the .env file (default is 3000).
🖥️ Client-Side Application
The client-side bundle is pre-built and served statically from the public folder. To rebuild the assets:

Navigate to the client-app directory:

cd client-app
Build the application using Angular CLI:

ng build
⚠️ Note: Ensure that Angular CLI is installed globally. You can install it using:

npm install -g @angular/cli
📖 Usage
To access the application, visit http://localhost:3000 in your browser.

🔐 Register / Login
Landing Page: Features two buttons at the top—Register and Login.
Register: Create a new account using your email, username, and password.
Login: Sign in using email and password or via Google OAuth.
Post-Login: After successful authentication, you will be redirected to the dashboard where you can manage your tasks.
➕ Adding Tasks
Dashboard Layout: Contains three columns—Open, In Progress, and Completed—representing task statuses.
Add a Task: Click the ➕ icon in the header of the column you want to add the task to.
A modal form will appear; fill in the task details and save.
The new task will appear at the bottom of the selected column, with the highest order value.
🔄 Task Ordering
Reordering Tasks: Drag and drop tasks within the same column to adjust their order. The top task has the lowest order value.
Moving Tasks Between Columns: Drag and drop tasks into different columns to update their status accordingly.
✏️ Editing and Viewing Tasks
Edit/Delete: Each task card includes options to edit or delete the task.
View Details: Click on a task card to open a modal displaying detailed information with options to edit the task.
🔍 Filtering Tasks
Available filters:

📅 Date Filter: Choose between due date or creation date to display tasks matching the selected date.
🏷️ Labels Filter: Select labels to show only tasks with the chosen labels.
🔎 Search Filter: Perform a case-insensitive search based on task title and description.
Clear Filters: Click the 🧹 clear button on the right to remove all applied filters.
🗄️ Archiving Tasks
Eligibility: Only tasks marked as Completed can be archived.
Archiving Options:
Individual: Click the 📥 archive icon on a specific task card to archive it.
Bulk: Click the 📥 archive icon in the Completed column header to archive all completed tasks.
Viewing Archived Tasks: A checkbox next to the archive icon will allow you to toggle the visibility of archived tasks. By default, archived tasks will be hidden.
Archived tasks moved to any column other than Completed will remain visible regardless of the checkbox status.
🛠️ Contributing
Contributions are welcome! Feel free to open issues or submit pull requests to improve this Todo App.

📄 License
This project is licensed under the MIT License.

📞 Contact
For any questions or suggestions, feel free to reach out at youssefboshra1@outlook.com.

🌟 Features
User Authentication: Secure login and registration with email and Google OAuth.
Task Management: Create, edit, delete, and organize tasks across different statuses.
Drag & Drop: Intuitive drag-and-drop interface for managing task order and status.
Filtering & Search: Powerful filtering options to quickly find tasks.
Archiving: Keep your completed tasks organized with archiving features.
