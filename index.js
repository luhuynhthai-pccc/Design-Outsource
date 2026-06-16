export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. ĐƯỜNG DẪN API: Lấy dữ liệu học sinh từ D1
    if (url.pathname === "/api/students") {
      const db = env['design-outsource']; // Sử dụng đúng binding của bạn

      try {
        const { results } = await db.prepare("SELECT * FROM students").all();
        return new Response(JSON.stringify(results), {
          headers: { 
            "Content-Type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*" // Cho phép truy cập chéo nếu cần
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" },
        });
      }
    }

    // 2. ĐƯỜNG DẪN MẶC ĐỊNH: Trả về giao diện HTML
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quản lý học sinh</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; background-color: #f9f9f9; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; background: #fff; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #0070f3; color: white; }
            tr:nth-child(even) { background-color: #f2f2f2; }
        </style>
    </head>
    <body>
        <h1>Danh sách học sinh (D1 Database)</h1>
        <table id="student-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Họ và Tên</th>
                    <th>Lớp</th>
                </tr>
            </thead>
            <tbody>
                <tr><td colspan="3">Đang tải dữ liệu từ D1...</td></tr>
            </tbody>
        </table>

        <script>
            // Gọi đến API được tích hợp sẵn trong Worker
            fetch('/api/students')
                .then(res => res.json())
                .then(data => {
                    const tbody = document.querySelector('#student-table tbody');
                    tbody.innerHTML = ''; 

                    if (data.error) {
                        tbody.innerHTML = '<tr><td colspan="3">Lỗi: ' + data.error + '</td></tr>';
                        return;
                    }

                    if (data.length === 0) {
                        tbody.innerHTML = '<tr><td colspan="3">Không có dữ liệu</td></tr>';
                        return;
                    }

                    data.forEach(student => {
                        tbody.innerHTML += '<tr>' +
                            '<td>' + student.id + '</td>' +
                            '<td>' + student.name + '</td>' +
                            '<td>' + student.class + '</td>' +
                        '</tr>';
                    });
                })
                .catch(err => {
                    console.error(err);
                    document.querySelector('#student-table tbody').innerHTML = '<tr><td colspan="3">Lỗi kết nối API</td></tr>';
                });
        </script>
    </body>
    </html>
    `;

    // Trả về giao diện HTML cho người dùng
    return new Response(htmlContent, {
      headers: { "Content-Type": "text/html;charset=UTF-8" },
    });
  }
};
