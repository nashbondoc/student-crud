import React, { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
    const [students, setStudents] = useState([])
    const [formData, setFormData] = useState({
        firstname: '',
        lastname: '',
        course: '',
        section: ''
    })

    const API_URL = 'http://localhost:8080/bondoc/students'

    const fetchStudents = () => {
        axios.get(API_URL)
            .then(response => {
                setStudents(response.data)
            })
            .catch(error => {
                console.error("Error fetching students:", error)
            })
    }

    useEffect(() => {
        fetchStudents()
    }, [])

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!formData.firstname || !formData.lastname || !formData.course || !formData.section) {
            alert("Please fill out all fields!")
            return
        }

        const studentPayload = {
            firstname: formData.firstname,
            firstName: formData.firstname,
            lastname: formData.lastname,
            lastName: formData.lastname,
            course: formData.course,
            section: formData.section
        }

        axios.post(API_URL, studentPayload)
            .then(() => {
                fetchStudents()
                setFormData({ firstname: '', lastname: '', course: '', section: '' })
            })
            .catch(error => {
                console.error("Network interface error:", error)
                alert("Failed to connect with database. Check your terminal logs.")
            })
    }

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to remove this record?")) {
            axios.delete(`${API_URL}/${id}`)
                .then(() => fetchStudents())
                .catch(error => console.error("Error deleting student:", error))
        }
    }

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.title}>🎓 Academic Management System</h1>
                <p style={styles.subtitle}>Real-time Full-Stack Student Information Hub</p>
            </header>

            <div style={styles.contentLayout}>
                <div style={styles.formCard}>
                    <h2 style={styles.cardTitle}>Enrolment Portal</h2>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>First Name</label>
                            <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} style={styles.input} placeholder="e.g., Mark" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Last Name</label>
                            <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} style={styles.input} placeholder="e.g., Bondoc" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Course of Study</label>
                            <input type="text" name="course" value={formData.course} onChange={handleChange} style={styles.input} placeholder="e.g., BSIT" />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Section Assignment</label>
                            <input type="text" name="section" value={formData.section} onChange={handleChange} style={styles.input} placeholder="e.g., 3A" />
                        </div>
                        <button type="submit" style={styles.submitBtn}>Register Student</button>
                    </form>
                </div>

                <div style={styles.tableCard}>
                    <div style={styles.tableHeaderSection}>
                        <h2 style={{ ...styles.cardTitle, margin: 0, color: '#ffffff' }}>Active Student Registry</h2>
                        <span style={styles.countBadge}>{students.length} Total Enrolled</span>
                    </div>
                    <div style={styles.tableWrapper}>
                        <table style={styles.table}>
                            <thead>
                            <tr>
                                <th style={styles.th}>System ID</th>
                                <th style={styles.th}>Student Name</th>
                                <th style={styles.th}>Course Path</th>
                                <th style={styles.th}>Class Section</th>
                                <th style={styles.th}>Management Action</th>
                            </tr>
                            </thead>
                            <tbody>
                            {students.length === 0 ? (
                                <tr>
                                    <td colSpan="5" style={styles.emptyRow}>
                                        ✨ Database array is empty. Submit the portal form to append a record!
                                    </td>
                                </tr>
                            ) : (
                                students.map(student => (
                                    <tr key={student.id} style={styles.trRow}>
                                        <td style={styles.tdId}>#{student.id}</td>
                                        <td style={styles.tdName}>{student.firstname} {student.lastname}</td>
                                        <td style={styles.td}><span style={styles.badge}>{student.course}</span></td>
                                        <td style={styles.tdSection}>{student.section}</td>
                                        <td style={styles.td}>
                                            <button onClick={() => handleDelete(student.id)} style={styles.deleteBtn}>Deregister</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: {
        fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
        backgroundColor: '#0f172a',
        backgroundImage: 'radial-gradient(circle at 10% 20%, rgba(99, 102, 241, 0.15) 0%, transparent 40%), radial-gradient(circle at 90% 80%, rgba(236, 72, 153, 0.15) 0%, transparent 40%)',
        minHeight: '100vh',
        padding: '40px 20px',
        boxSizing: 'border-box',
        color: '#f8fafc'
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px'
    },
    title: {
        margin: '0 0 10px 0',
        fontSize: '36px',
        fontWeight: '800',
        letterSpacing: '-0.5px',
        background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
    },
    subtitle: {
        margin: 0,
        fontSize: '16px',
        color: '#94a3b8',
        fontWeight: '400'
    },
    contentLayout: {
        display: 'flex',
        gap: '30px',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap'
    },
    formCard: {
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        flex: '1 1 350px'
    },
    tableCard: {
        background: 'rgba(30, 41, 59, 0.7)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        padding: '30px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)',
        flex: '2 1 600px'
    },
    tableHeaderSection: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        paddingBottom: '20px',
        marginBottom: '20px'
    },
    countBadge: {
        background: 'linear-gradient(135deg, #a855f7 0%, #6366f1 100%)',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
        color: '#ffffff',
        boxShadow: '0 4px 10px rgba(99, 102, 241, 0.3)'
    },
    cardTitle: {
        fontSize: '22px',
        fontWeight: '700',
        color: '#f8fafc',
        letterSpacing: '-0.3px'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        marginTop: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
    },
    label: {
        fontSize: '12px',
        fontWeight: '600',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
    },
    input: {
        padding: '12px 16px',
        borderRadius: '8px',
        backgroundColor: '#0f172a',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        color: '#f8fafc',
        fontSize: '14px',
        outline: 'none',
    },
    submitBtn: {
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)',
        color: 'white',
        border: 'none',
        padding: '14px',
        borderRadius: '8px',
        fontSize: '15px',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '10px',
        boxShadow: '0 10px 15px -3px rgba(168, 85, 247, 0.4)',
    },
    tableWrapper: {
        overflowX: 'auto'
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        textAlign: 'left'
    },
    th: {
        padding: '16px 20px',
        backgroundColor: '#0f172a',
        color: '#94a3b8',
        fontWeight: '600',
        fontSize: '13px',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        borderBottom: '2px solid rgba(255,255,255,0.05)'
    },
    td: {
        padding: '16px 20px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    tdId: {
        padding: '16px 20px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        color: '#a855f7',
        fontWeight: '700'
    },
    tdName: {
        padding: '16px 20px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        fontWeight: '600',
        color: '#ffffff'
    },
    tdSection: {
        padding: '16px 20px',
        fontSize: '14px',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        color: '#e2e8f0'
    },
    trRow: {
        borderBottom: '1px solid rgba(255,255,255,0.05)',
    },
    emptyRow: {
        textAlign: 'center',
        padding: '40px 20px',
        color: '#64748b',
        fontSize: '14px'
    },
    badge: {
        background: 'rgba(99, 102, 241, 0.15)',
        color: '#818cf8',
        border: '1px solid rgba(99, 102, 241, 0.3)',
        padding: '4px 10px',
        borderRadius: '6px',
        fontSize: '12px',
        fontWeight: '600'
    },
    deleteBtn: {
        background: 'rgba(239, 68, 68, 0.1)',
        color: '#f87171',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        padding: '6px 14px',
        borderRadius: '6px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: '600',
    }
}

export default App