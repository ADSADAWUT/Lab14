const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskPriority = document.getElementById('taskPriority');
const taskList = document.getElementById('taskList');

let tasks = [];

// ดึงข้อมูลงานทั้งหมดจาก Backend
const fetchTasks = async () => {
    try {
        const response = await fetch('https://YOUR-APP.onrender.com/tasks');
        const data = await response.json();

        tasks = data.map(item => {
            return {
                id: item._id,
                title: item.title,
                completed: item.completed,
                priority: item.priority || "low" // กำหนดค่าเริ่มต้นเอง
            };
        });

        renderTasks();
    } catch (error) {
        console.error("ดึงข้อมูลไม่สำเร็จ:", error);
        taskList.innerHTML = '<li class="empty">เชื่อมต่อ Server ไม่ได้</li>';
    }
};

// เพิ่มงาน
const addTask = async (title, priority) => {
    try {
        await fetch('https://YOUR-APP.onrender.com/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // ต้องบอกเซิร์ฟเวอร์ว่าส่ง JSON ไป
            },
            body: JSON.stringify({ title: title, priority: priority }) // แพ็คของลงกล่อง
        });

        // เมื่อเพิ่มที่ Backend เสร็จ สั่งดึงข้อมูลล่าสุดมาวาดใหม่
        fetchTasks();
    } catch (error) {
        console.error("เพิ่มงานไม่สำเร็จ:", error);
    }
};

// สลับสถานะงาน
const toggleTaskStatus = async (id) => {
    try {
        await fetch(`https://YOUR-APP.onrender.com/tasks/${id}`, {
            method: 'PUT'
        });
        fetchTasks(); // ดึงข้อมูลใหม่
    } catch (error) {
        console.error("เปลี่ยนสถานะไม่สำเร็จ:", error);
    }
};

// ลบงาน
const deleteTask = async (id) => {
    try {
        await fetch(`https://YOUR-APP.onrender.com/tasks/${id}`, {
            method: 'DELETE'
        });
        fetchTasks(); // ดึงข้อมูลใหม่
    } catch (error) {
        console.error("ลบงานไม่สำเร็จ:", error);
    }
};

// วาดรายการงานลงหน้าเว็บ
const renderTasks = () => {
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="empty">ยังไม่มีงาน</li>';
        return;
    }
    taskList.innerHTML = tasks.map(task => `
        <li class="${task.priority} ${task.completed ? 'completed' : ''}">
            <span class="title">${task.title}</span>
            <span class="badge">${task.priority}</span>
            <button class="btn-toggle" onclick="handleToggle('${task.id}')">${task.completed ? 'ยกเลิก' : 'เสร็จ'}</button>
            <button class="btn-delete" onclick="handleDelete('${task.id}')">ลบ</button>
        </li>
    `).join('');
};

const handleToggle = (id) => {
    toggleTaskStatus(id);
};

const handleDelete = (id) => {
    deleteTask(id);
};

taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = taskTitle.value.trim();
    if (!title) return;
    addTask(title, taskPriority.value);
    taskForm.reset();
});

// เริ่มต้น
fetchTasks();
