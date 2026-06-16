export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    if (
      url.pathname === "/api/save-request" &&
      request.method === "POST"
    ) {

      const body = await request.json();

      await env.DB.prepare(`
        INSERT INTO quotation_requests
        (
          project_name,
          outsource_name,
          quotation_value
        )
        VALUES (?, ?, ?)
      `)
      .bind(
        body.project_name,
        body.outsource_name,
        body.quotation_value
      )
      .run();

      return Response.json({
        success: true,
        message: "Đã lưu dữ liệu"
      });
    }

    return env.ASSETS.fetch(request);
  }
};
