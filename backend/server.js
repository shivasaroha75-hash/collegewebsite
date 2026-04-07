const fs = require("fs");
const multer = require("multer");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const express = require("express");
const cors = require("cors");

const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use("/uploads", require("express").static(require("path").join(__dirname, "uploads")));


// SQLite database connection
const dbPath = path.join(__dirname, "database", "college.db");

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Database connection error:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create tables if not exists
db.serialize(() => {

  // Admin table
  db.run(`
    CREATE TABLE IF NOT EXISTS admins (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      password TEXT NOT NULL
    )
  `);

  db.run(`ALTER TABLE admins ADD COLUMN phone TEXT`, (err) => {
    if (err) {
      console.log("phone column may already exist");
    } else {
      console.log("phone column added");
    }
  });

  db.run(`CREATE TABLE IF NOT EXISTS otp_codes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  phone TEXT,
  otp TEXT,
  expires_at DATETIME
)`);

  // Notices table
  db.run(`
    CREATE TABLE IF NOT EXISTS notices (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      pdf_file TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.all("PRAGMA table_info(notices)", (err, columns) => {

  const hasImportant = columns.some(col => col.name === "important");

  if (!hasImportant) {
    db.run("ALTER TABLE notices ADD COLUMN important INTEGER DEFAULT 0");
  }

});



  // Admissions table
  db.run(`
    CREATE TABLE IF NOT EXISTS admissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      pdf_file TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Principal table (single record)
  db.run(`
    CREATE TABLE IF NOT EXISTS principal (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      designation TEXT,
      message TEXT,
      photo TEXT
    )
  `);

  db.run(`
  CREATE TABLE IF NOT EXISTS faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    department TEXT,
    designation TEXT,
    photo TEXT
  )
`);

db.run(`
CREATE TABLE IF NOT EXISTS student_resources (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  type TEXT,   -- syllabus / timetable
  file TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

db.run(`ALTER TABLE faculty ADD COLUMN designation TEXT`, (err) => {
    if (err) {
      console.log("designation column may already exist");
    } else {
      console.log("designation column added");
    }
  });

  db.run(`ALTER TABLE faculty ADD COLUMN qualification TEXT`, (err) => {
    if (err) {
      console.log("qualification column may already exist");
    } else {
      console.log("qualification column added");
    }
  });

  db.run(`ALTER TABLE faculty ADD COLUMN experience TEXT`, (err) => {
    if (err) {
      console.log("experience column may already exist");
    } else {
      console.log("experience column added");
    }
  });



// Gallery table
db.run(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    image TEXT
  )
`);



// Professional Courses (IT / Animation)
db.run(`
  CREATE TABLE IF NOT EXISTS professional_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT,
    description TEXT
  )
`);

db.run(`ALTER TABLE professional_courses ADD COLUMN details TEXT`, (err)=>{
  if(err){
    console.log("details column may already exist");
  }
});

// IT Technologies (7 only)
db.run(`
  CREATE TABLE IF NOT EXISTS it_technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tech_name TEXT,
    description TEXT,
    career_scope TEXT
  )
`);

// Professional Faculty (IT / Animation)
db.run(`
  CREATE TABLE IF NOT EXISTS professional_faculty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    course TEXT,
    designation TEXT,
    photo TEXT
  )
`);

// Animation Technologies table
db.run(`
  CREATE TABLE IF NOT EXISTS animation_technologies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tech_name TEXT,
    description TEXT,
    career_scope TEXT
  )
`);
// Course Teachers (IT + Animation)
db.run(`
  CREATE TABLE IF NOT EXISTS course_teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    designation TEXT,
    experience TEXT,
    course_type TEXT,   -- IT or ANIMATION
    photo TEXT
  )
`);

  db.run(`
  CREATE TABLE IF NOT EXISTS college_courses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    course_name TEXT,
    duration TEXT,
    description TEXT
  )
  `);

  db.run(`
CREATE TABLE IF NOT EXISTS academic_calendar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT,
  description TEXT
)
`);

db.run(`
CREATE TABLE IF NOT EXISTS calendar (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT,
  date TEXT,
  description TEXT
)
`);

  /* ADD NEW COLUMNS IF NOT EXIST */

  db.run(`ALTER TABLE college_courses ADD COLUMN subjects TEXT`, (err) => {
    if (err) {
      console.log("subjects column may already exist");
    } else {
      console.log("subjects column added");
    }
  });

  db.run(`ALTER TABLE college_courses ADD COLUMN syllabus TEXT`, (err) => {
    if (err) {
      console.log("syllabus column may already exist");
    } else {
      console.log("syllabus column added");
    }
  });



});



db.run(
  "INSERT OR IGNORE INTO admins (id, username, password) VALUES (1, 'admin', 'admin123')"
);

const resourceStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/resources");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});



const uploadResource = multer({ storage: resourceStorage });

// Multer setup for Notice PDFs
const noticeStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notices");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadNoticePDF = multer({ storage: noticeStorage });

const jwt = require("jsonwebtoken");


const noticeStorage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/notices");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadNotice = multer({ storage: noticeStorage2 });

// Multer setup for Admission PDFs
const admissionStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/admissions");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadAdmissionPDF = multer({ storage: admissionStorage });

// Multer setup for Principal photo
const principalStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/principal");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadPrincipalPhoto = multer({ storage: principalStorage });

// Multer setup for Faculty photo
const facultyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/faculty");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadFacultyPhoto = multer({ storage: facultyStorage });

const galleryStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "uploads/gallery"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadGalleryImage = multer({ storage: galleryStorage });

// ===== MULTER FOR PROFESSIONAL FACULTY =====
const professionalFacultyStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/professional-faculty");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadProfessionalFaculty = multer({
  storage: professionalFacultyStorage
});

// Multer for Course Teachers
const courseTeacherStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/course-teachers");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const uploadCourseTeacher = multer({ storage: courseTeacherStorage });

// Admin Login API
app.post("/api/admin/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM admins WHERE username = ? AND password = ?",
    [username, password],
    (err, admin) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: admin.id, username: admin.username },
        "secretkey",
        { expiresIn: "1h" }
      );

      res.json({ token });
    }
  );
});

const auth = require("./middleware/auth");

// ADD Notice (Admin only, with PDF)
app.post(
  "/api/notices",
  auth,
  uploadNoticePDF.single("pdf"),
  (req, res) => {
    const { title, description } = req.body;
    const pdfFile = req.file ? req.file.filename : null;

    db.run(
      "INSERT INTO notices (title, description, pdf_file) VALUES (?, ?, ?)",
      [title, description, pdfFile],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
          id: this.lastID,
          title,
          description,
          pdf_file: pdfFile
        });
      }
    );
  }
);

// GET Notices (Public)
app.get("/api/notices", (req, res) => {
  db.all(
    "SELECT * FROM notices ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

// UPDATE Notice (Admin only, PDF optional)
app.put(
  "/api/notices/:id",
  auth,
  uploadNoticePDF.single("pdf"),
  (req, res) => {
    const { title, description } = req.body;
    const pdfFile = req.file ? req.file.filename : null;

    let sql = "UPDATE notices SET title = ?, description = ?";
    let params = [title, description];

    if (pdfFile) {
      sql += ", pdf_file = ?";
      params.push(pdfFile);
    }

    sql += " WHERE id = ?";
    params.push(req.params.id);

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Notice updated successfully" });
    });
  }
);

// DELETE Notice (Admin only)
app.delete("/api/notices/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM notices WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Notice deleted successfully" });
    }
  );
});

// ADD Admission Notification (Admin only)
app.post(
  "/api/admissions",
  auth,
  uploadAdmissionPDF.single("pdf"),
  (req, res) => {
    const { title, description } = req.body;
    const pdfFile = req.file ? req.file.filename : null;

    db.run(
      "INSERT INTO admissions (title, description, pdf_file) VALUES (?, ?, ?)",
      [title, description, pdfFile],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
          id: this.lastID,
          title,
          description,
          pdf_file: pdfFile
        });
      }
    );
  }
);

// GET Admission Notifications (Public)
app.get("/api/admissions", (req, res) => {
  db.all(
    "SELECT * FROM admissions ORDER BY created_at DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

// UPDATE Admission (Admin only, PDF optional)
app.put(
  "/api/admissions/:id",
  auth,
  uploadAdmissionPDF.single("pdf"),
  (req, res) => {
    const { title, description } = req.body;
    const pdfFile = req.file ? req.file.filename : null;

    let sql = "UPDATE admissions SET title = ?, description = ?";
    let params = [title, description];

    if (pdfFile) {
      sql += ", pdf_file = ?";
      params.push(pdfFile);
    }

    sql += " WHERE id = ?";
    params.push(req.params.id);

    db.run(sql, params, function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Admission updated successfully" });
    });
  }
);

// DELETE Admission (Admin only)
app.delete("/api/admissions/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM admissions WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Admission deleted successfully" });
    }
  );
});

// ADD or UPDATE Principal (Admin only + delete old photo)
app.post(
  "/api/principal",
  auth,
  uploadPrincipalPhoto.single("photo"),
  (req, res) => {
    const { name, designation, message } = req.body;
    const newPhoto = req.file ? req.file.filename : null;

    // 1️⃣ check existing principal
    db.get("SELECT * FROM principal LIMIT 1", [], (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      // UPDATE case
      if (row) {
        const oldPhoto = row.photo;

        let sql =
          "UPDATE principal SET name = ?, designation = ?, message = ?";
        let params = [name, designation, message];

        if (newPhoto) {
          sql += ", photo = ?";
          params.push(newPhoto);
        }

        sql += " WHERE id = ?";
        params.push(row.id);

        db.run(sql, params, function (err) {
          if (err) {
            return res.status(500).json({ message: "Database error" });
          }

          // old photo delete
          if (newPhoto && oldPhoto) {
            const oldPath = `uploads/principal/${oldPhoto}`;
            fs.unlink(oldPath, (err) => {
              if (err && err.code !== "ENOENT") {
                console.error("Principal photo delete error:", err);
              }
            });
          }

          res.json({ message: "Principal updated successfully" });
        });
      }
      // INSERT case (first time)
      else {
        db.run(
          "INSERT INTO principal (name, designation, message, photo) VALUES (?, ?, ?, ?)",
          [name, designation, message, newPhoto],
          function (err) {
            if (err) {
              return res.status(500).json({ message: "Database error" });
            }

            res.status(201).json({
              id: this.lastID,
              name,
              designation,
              message,
              photo: newPhoto
            });
          }
        );
      }
    });
  }
);

// GET Principal (Public)
app.get("/api/principal", (req, res) => {
  db.get("SELECT * FROM principal LIMIT 1", [], (err, row) => {
    if (err) {
      return res.status(500).json({ message: "Database error" });
    }
    res.json(row || {});
  });
});

/* GET ALL FACULTY */

app.get("/api/faculty", (req, res) => {

db.all("SELECT * FROM faculty", [], (err, rows) => {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json(rows);

});

});


/* GET SINGLE FACULTY */

app.get("/api/faculty/:id", (req, res) => {

const id = req.params.id;

db.get(
"SELECT * FROM faculty WHERE id=?",
[id],
(err, row) => {

if (err) {
return res.status(500).json({ message: "Database error" });
}

if (!row) {
return res.status(404).json({ message: "Faculty not found" });
}

res.json(row);

});

});


/* ADD FACULTY */

app.post(
"/api/faculty",
auth,
uploadFacultyPhoto.single("photo"),
(req, res) => {

const { name, department, designation, qualification, experience } = req.body;

const photo = req.file ? req.file.filename : null;

db.run(
`INSERT INTO faculty 
(name, department, designation, qualification, experience, photo)
VALUES (?, ?, ?, ?, ?, ?)`,
[name, department, designation, qualification, experience, photo],
function (err) {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json({
id: this.lastID,
name,
department,
designation,
qualification,
experience,
photo
});

}

);

}
);


/* UPDATE FACULTY */

app.put(
"/api/faculty/:id",
auth,
uploadFacultyPhoto.single("photo"),
(req, res) => {

const { name, department, designation, qualification, experience } = req.body;

const photo = req.file ? req.file.filename : null;

let query;
let params;

if (photo) {

query = `
UPDATE faculty
SET name=?, department=?, designation=?, qualification=?, experience=?, photo=?
WHERE id=?
`;

params = [name, department, designation, qualification, experience, photo, req.params.id];

} else {

query = `
UPDATE faculty
SET name=?, department=?, designation=?, qualification=?, experience=?
WHERE id=?
`;

params = [name, department, designation, qualification, experience, req.params.id];

}

db.run(query, params, function (err) {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json({ message: "Faculty updated successfully" });

});

}
);


/* DELETE FACULTY */

app.delete("/api/faculty/:id", auth, (req, res) => {

db.run(
"DELETE FROM faculty WHERE id=?",
[req.params.id],
function (err) {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json({ message: "Faculty deleted successfully" });

}

);

});

// ADD Gallery Image (Admin only)
app.post(
  "/api/gallery",
  auth,
  uploadGalleryImage.single("image"),
  (req, res) => {
    const { title } = req.body;
    const image = req.file ? req.file.filename : null;

    db.run(
      "INSERT INTO gallery (title, image) VALUES (?, ?)",
      [title, image],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
          id: this.lastID,
          title,
          image
        });
      }
    );
  }
);

// GET Gallery (Public)
app.get("/api/gallery", (req, res) => {
  db.all(
    "SELECT * FROM gallery ORDER BY id DESC",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

// DELETE Gallery Image (Admin only + delete file)
app.delete("/api/gallery/:id", auth, (req, res) => {
  // 1️⃣ pehle image ka naam lao
  db.get(
    "SELECT image FROM gallery WHERE id = ?",
    [req.params.id],
    (err, row) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (!row) {
        return res.status(404).json({ message: "Gallery image not found" });
      }

      const imageName = row.image;

      // 2️⃣ DB se record delete karo
      db.run(
        "DELETE FROM gallery WHERE id = ?",
        [req.params.id],
        function (err) {
          if (err) {
            return res.status(500).json({ message: "Database error" });
          }

          // 3️⃣ File delete karo
          if (imageName) {
            const imagePath = `uploads/gallery/${imageName}`;
            fs.unlink(imagePath, (err) => {
              if (err && err.code !== "ENOENT") {
                console.error("Gallery image delete error:", err);
              }
            });
          }

          res.json({ message: "Gallery image deleted successfully" });
        }
      );
    }
  );
});

// ===== PROFESSIONAL COURSES =====

app.post("/api/professional-courses", auth, (req, res) => {

const { course_name, description, details } = req.body;

db.run(
`INSERT INTO professional_courses (course_name, description, details)
VALUES (?, ?, ?)`,
[course_name, description, details],
function(err){

if(err){
return res.status(500).json({message:"Database error"});
}

res.json({ id:this.lastID });

});

});


app.get("/api/professional-courses/:id", (req,res)=>{

const id = req.params.id;

db.get(
"SELECT * FROM professional_courses WHERE id=?",
[id],
(err,row)=>{

if(err){
return res.status(500).json({message:"Database error"});
}

if(!row){
return res.status(404).json({message:"Course not found"});
}

res.json(row);

});

});

// delete professional course (admin only)
app.delete("/api/professional-courses/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM professional_courses WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Professional course deleted successfully" });
    }
  );
});

// GET (Public)
app.get("/api/professional-courses", (req, res) => {
  db.all("SELECT * FROM professional_courses", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// ===== IT TECHNOLOGIES =====

// ADD IT Technology (Admin)
app.post("/api/it-technologies", auth, (req, res) => {
  const { tech_name, description, career_scope } = req.body;

  db.run(
    "INSERT INTO it_technologies (tech_name, description, career_scope) VALUES (?, ?, ?)",
    [tech_name, description, career_scope],
    function (err) {
      if (err) return res.status(500).json({ message: "Database error" });
      res.status(201).json({ id: this.lastID, tech_name });
    }
  );
});

// GET IT Technologies (Public)
app.get("/api/it-technologies", (req, res) => {
  db.all("SELECT * FROM it_technologies", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// ===== ANIMATION TECHNOLOGIES =====

// ADD Animation Technology (Admin)
app.post("/api/animation-technologies", auth, (req, res) => {
  const { tech_name, description, career_scope } = req.body;

  db.run(
    "INSERT INTO animation_technologies (tech_name, description, career_scope) VALUES (?, ?, ?)",
    [tech_name, description, career_scope],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.status(201).json({
        id: this.lastID,
        tech_name,
        description,
        career_scope
      });
    }
  );
});

// GET Animation Technologies (Public)
app.get("/api/animation-technologies", (req, res) => {
  db.all(
    "SELECT * FROM animation_technologies",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

// ===== PROFESSIONAL FACULTY =====

// ADD Professional Faculty (Admin)
app.post(
  "/api/professional-faculty",
  auth,
  uploadProfessionalFaculty.single("photo"),
  (req, res) => {
    const { name, course, designation } = req.body;
    const photo = req.file ? req.file.filename : null;

    db.run(
      "INSERT INTO professional_faculty (name, course, designation, photo) VALUES (?, ?, ?, ?)",
      [name, course, designation, photo],
      function (err) {
        if (err) return res.status(500).json({ message: "Database error" });
        res.status(201).json({ id: this.lastID, name });
      }
    );
  }
);

// DELETE Animation Technology (Admin only)
app.delete("/api/animation-technologies/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM animation_technologies WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }

      if (this.changes === 0) {
        return res.status(404).json({ message: "Animation technology not found" });
      }

      res.json({ message: "Animation technology deleted successfully" });
    }
  );
});

app.put("/api/professional-courses/:id", (req, res) => {

const { details } = req.body;

db.run(
"UPDATE professional_courses SET details=? WHERE id=?",
[details, req.params.id],
function (err) {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json({ message: "Course updated successfully" });

});

});

// GET Professional Faculty (Public)
app.get("/api/professional-faculty", (req, res) => {
  db.all("SELECT * FROM professional_faculty", [], (err, rows) => {
    if (err) return res.status(500).json({ message: "Database error" });
    res.json(rows);
  });
});

// ADD Course Teacher (Admin only)
app.post(
  "/api/course-teachers",
  auth,
  uploadCourseTeacher.single("photo"),
  (req, res) => {
    const { name, designation, experience, course_type } = req.body;
    const photo = req.file ? req.file.filename : null;

    db.run(
      `INSERT INTO course_teachers 
       (name, designation, experience, course_type, photo)
       VALUES (?, ?, ?, ?, ?)`,
      [name, designation, experience, course_type, photo],
      function (err) {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }
        res.status(201).json({
          id: this.lastID,
          name,
          designation,
          experience,
          course_type,
          photo
        });
      }
    );
  }
);

// GET IT + Animation teachers (Public)
app.get("/api/course-teachers", (req, res) => {
  db.all(
    "SELECT * FROM course_teachers",
    [],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json(rows);
    }
  );
});

app.delete("/api/course-teachers/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM course_teachers WHERE id = ?",
    [req.params.id],
    function (err) {
      if (err) {
        return res.status(500).json({ message: "Database error" });
      }
      res.json({ message: "Teacher deleted successfully" });
    }
  );
});

// UPDATE Course Teacher (Admin only)
// UPDATE Course Teacher (Admin only + delete old photo)
app.put(
  "/api/course-teachers/:id",
  auth,
  uploadCourseTeacher.single("photo"),
  (req, res) => {
    const { name, designation, experience, course_type } = req.body;
    const newPhoto = req.file ? req.file.filename : null;

    // 1️⃣ Pehle purana teacher record lao
    db.get(
      "SELECT photo FROM course_teachers WHERE id = ?",
      [req.params.id],
      (err, row) => {
        if (err) {
          return res.status(500).json({ message: "Database error" });
        }

        if (!row) {
          return res.status(404).json({ message: "Teacher not found" });
        }

        const oldPhoto = row.photo;

        // 2️⃣ SQL + params
        let sql =
          "UPDATE course_teachers SET name = ?, designation = ?, experience = ?, course_type = ?";
        let params = [name, designation, experience, course_type];

        if (newPhoto) {
          sql += ", photo = ?";
          params.push(newPhoto);
        }

        sql += " WHERE id = ?";
        params.push(req.params.id);

        // 3️⃣ Update DB
        db.run(sql, params, function (err) {
          if (err) {
            return res.status(500).json({ message: "Database error" });
          }

          // 4️⃣ Purani photo delete karo (agar nayi aayi ho)
          if (newPhoto && oldPhoto) {
            const oldPath = `uploads/course-teachers/${oldPhoto}`;

            fs.unlink(oldPath, (err) => {
              // agar file missing ho to ignore
              if (err && err.code !== "ENOENT") {
                console.error("Old photo delete error:", err);
              }
            });
          }

          res.json({ message: "Teacher updated successfully" });
        });
      }
    );
  }
);

app.post("/api/college-courses", auth, (req, res) => {

const { course_name, duration, description, subjects, syllabus } = req.body;

db.run(
`INSERT INTO college_courses 
(course_name, duration, description, subjects, syllabus)
VALUES (?, ?, ?, ?, ?)`,
[course_name, duration, description, subjects, syllabus],
function(err){

if(err){
console.error(err);
return res.status(500).json({message:"Database error"});
}

res.json({
id:this.lastID,
course_name,
duration,
description,
subjects,
syllabus
});

});

});

app.get("/api/college-courses", (req, res) => {

db.all("SELECT * FROM college_courses", [], (err, rows) => {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json(rows);

});

});

app.get("/api/college-courses/:id", (req, res) => {

const id = req.params.id;

db.get(
"SELECT * FROM college_courses WHERE id=?",
[id],
(err, row) => {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json(row);

}
);

});

app.delete("/api/college-courses/:id", auth, (req, res) => {

db.run(
"DELETE FROM college_courses WHERE id=?",
[req.params.id],
function (err) {

if (err) {
return res.status(500).json({ message: "Database error" });
}

res.json({ message: "Course deleted" });

}
);

});

// ================= CALENDAR API =================

// GET all events
app.get("/api/calendar", (req, res) => {

  db.all("SELECT * FROM calendar", [], (err, rows) => {

    if (err) {
      console.log(err);
      return res.status(500).json({ message: "Database error" });
    }

    res.json(rows);

  });

});


// POST add event (admin)
app.post("/api/calendar", auth, (req, res) => {

  const { title, date, description } = req.body;

  db.run(
    "INSERT INTO calendar (title, date, description) VALUES (?, ?, ?)",
    [title, date, description],
    function (err) {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({
        id: this.lastID,
        title,
        date,
        description
      });

    }
  );

});


// DELETE event
app.delete("/api/calendar/:id", auth, (req, res) => {

  db.run(
    "DELETE FROM calendar WHERE id=?",
    [req.params.id],
    function (err) {

      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Database error" });
      }

      res.json({ message: "Deleted successfully" });

    }
  );

});
// ================= STUDENT RESOURCES =================

app.post("/api/student-resources", auth, uploadResource.single("file"), (req,res)=>{

const { title, type } = req.body;
const file = req.file?.filename;

if(!title || !file){
return res.status(400).json({ message:"Missing fields" });
}

db.run(
"INSERT INTO student_resources (title,type,file) VALUES (?,?,?)",
[title,type,file],
function(err){

if(err){
console.log(err);
return res.status(500).json({ message:"DB error" });
}

res.json({ id:this.lastID });

});

});

app.get("/api/student-resources", (req,res)=>{

db.all("SELECT * FROM student_resources ORDER BY id DESC", [], (err,rows)=>{

if(err) return res.status(500).json({ message:"DB error" });

res.json(rows);

});

});

app.delete("/api/student-resources/:id", auth, (req,res)=>{

db.run("DELETE FROM student_resources WHERE id=?", [req.params.id]);

res.json({ message:"Deleted" });

});

// test route
app.get("/", (req, res) => {
  res.send("Backend is running with Express + SQLite (step by step)");
});



app.get("/debug/tables", (req, res) => {
  db.all(
    "SELECT name FROM sqlite_master WHERE type='table'",
    [],
    (err, rows) => {
      if (err) return res.json(err);
      res.json(rows);
    }
  );
});

const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
  user: "ccsgdc.chhaprauli@gmail.com",
  pass: "srpg zhop vqqi xvbk"
}

});

app.post("/api/send-otp-email", async (req,res)=>{

const { email } = req.body;

const otp = Math.floor(100000 + Math.random()*900000).toString();

const expires = new Date(Date.now() + 5*60*1000);

// DB में save करो
db.run(
"INSERT INTO otp_codes (phone, otp, expires_at) VALUES (?,?,?)",
[email, otp, expires]
);

try{

await transporter.sendMail({
  from: "shivasaroha75@gmail.com",
  to: email,
  subject: "Your OTP Code",
  html: `<h2>Your OTP is: ${otp}</h2>`
});

res.json({ message:"OTP sent to email" });

}catch(err){
console.log(err);
res.status(500).json({ message:"Email failed" });
}

});

app.post("/api/verify-otp-email",(req,res)=>{

const { email, otp } = req.body;

db.get(
"SELECT * FROM otp_codes WHERE phone=? ORDER BY id DESC LIMIT 1",
[email],
(err,row)=>{

if(!row) return res.status(400).json({message:"No OTP found"});

if(row.otp !== otp){
return res.status(400).json({message:"Invalid OTP"});
}

if(new Date() > new Date(row.expires_at)){
return res.status(400).json({message:"OTP expired"});
}

db.run("DELETE FROM otp_codes WHERE phone=?", [email]);

const token = require("jsonwebtoken").sign(
{ email },
"secretkey",
{ expiresIn:"2h" }
);

res.json({ token });

});

});

const axios = require("axios");

app.post("/api/send-otp", async (req,res)=>{

const { phone } = req.body;

const otp = Math.floor(100000 + Math.random()*900000).toString();

const expires = new Date(Date.now() + 5*60*1000);

// DB में save करो
db.run(
"INSERT INTO otp_codes (phone, otp, expires_at) VALUES (?,?,?)",
[phone, otp, expires]
);

try{

await axios.get("https://www.fast2sms.com/dev/bulkV2", {
params:{
authorization:"j7g4OG3lQs9wah0ILZM5BXfPVzmrTRUJu8YcE1kxpivWqoHANyyfi0T43ZXjFp8U751qnElCvIoNA2Ye",
variables_values: otp,
route:"otp",
numbers: phone
}
});

console.log("OTP:", otp);

res.json({ message:"OTP sent to mobile" });

}catch(err){

console.log(err.response?.data || err.message);

res.status(500).json({ message:"SMS failed" });

}

});


app.post("/api/verify-otp",(req,res)=>{

const { phone, otp } = req.body;

db.get(
"SELECT * FROM otp_codes WHERE phone=? ORDER BY id DESC LIMIT 1",
[phone],
(err,row)=>{

if(!row) return res.status(400).json({message:"No OTP found"});

if(row.otp !== otp){
return res.status(400).json({message:"Invalid OTP"});
}

if(new Date() > new Date(row.expires_at)){
return res.status(400).json({message:"OTP expired"});
}

/* LOGIN SUCCESS */
const token = jwt.sign({ phone }, "secretkey", { expiresIn:"2h" });

res.json({ token });

});

});

app.post("/api/notices", auth, uploadNotice.single("pdf"), (req,res)=>{

const { title, description, important } = req.body;
const pdf = req.file?.filename;

db.run(
"INSERT INTO notices (title, description, pdf_file, important) VALUES (?, ?, ?, ?)",
[title, description, pdf, important ? 1 : 0],
function(err){

if(err){
return res.status(500).json({ message:"DB error" });
}

res.json({ id:this.lastID });

});

});

// start server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
