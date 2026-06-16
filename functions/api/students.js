export async function onRequest(context) {
  // Sử dụng ngoặc vuông để gọi tên binding có chứa dấu gạch ngang (-)
  const db = context.env['design-outsource'];

  try {
    // Thực hiện truy vấn cơ sở dữ liệu D1
    const { results } = await db.prepare("SELECT * FROM students").all();

    // Trả về dữ liệu dưới dạng JSON
    return new Response(JSON.stringify(results), {
      headers: { 
        "Content-Type": "application/json;charset=UTF-8" 
      },
    });
  } catch (error) {
    // Trả về thông báo lỗi nếu có sự cố
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
