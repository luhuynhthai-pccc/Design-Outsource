export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/api/students") {
      return Response.json([
        { name: "Nguyễn Văn A" },
        { name: "Trần Văn B" }
      ]);
    }

    return new Response("Not Found", { status: 404 });
  }
}
