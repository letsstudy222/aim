# AIM 2.7.0 — AI Marketing Engineer | FINAL

Ngày phát hành: 26/11/2026. Bản chính thức để triển khai GitHub Pages. Website tĩnh, không cần build, backend, đăng nhập hoặc API trả phí. FINAL là gói bàn giao, chưa phải chứng nhận chạy thành công trên hosting thực tế.

## Cập nhật repository `aim`
1. Mở https://letsstudy222.github.io/aim/ trên trình duyệt đang học. Xuất sao lưu từ Nhật ký (nếu bản cũ chỉ có v1, file đó không chứa đủ mọi dữ liệu). Không xóa dữ liệu trình duyệt. Giữ bản sao lưu riêng tư.
2. Giải nén ZIP. Tải tất cả file và thư mục bên trong lên đúng thư mục nguồn GitHub Pages hiện tại (thường là `main`, `/ (root)`). Phải có `index.html`, `assets/`, `js/`, `practice/`, `sw.js`, `manifest.webmanifest` cùng cấp. Không upload nguyên ZIP hoặc thư mục bao ngoài; giữ đúng tên và cấu trúc thư mục. Commit changes. Không cần đổi URL, không cần cài phần mềm.
3. Đợi GitHub Actions/Pages báo triển khai thành công, mở lại URL bằng cùng trình duyệt. Nếu thấy bản cũ, tải lại mạnh Ctrl+Shift+R hoặc đóng/mở lại tab. Không xóa localStorage. Kiểm tra Cài đặt ghi 2.7.0. Kiểm tra tiến độ trước khi cân nhắc nhập backup (nhập sẽ thay các nhóm trong file).
4. Làm smoke test bên dưới. Nếu có lỗi, giữ backup, ghi URL, phiên bản, thiết bị, thao tác và ảnh lỗi để chẩn đoán. Không xóa dữ liệu.

## Kiểm tra sau khi deploy (chưa xác nhận trong môi trường tạo bản này)
- [ ] Trang chủ mở đúng bản 2.7.0, không báo lỗi lưu trữ; số ngày và nhật ký cũ đúng.
- [ ] Tiếp tục học, tìm SQL, mở kho tham khảo và bài cũ; menu mobile đóng/mở đúng.
- [ ] Ôn nhanh cốt lõi, lật flashcard, chạy lab AI/marketing và tải một file thực hành.
- [ ] Ghi thử một bằng chứng, tải lại trang và xác nhận còn dữ liệu. Xuất sao lưu JSON v2 và mở file kiểm tra đủ 14 nhóm. Không nhập file tùy tiện hoặc xóa tiến độ để thử.
- [ ] Khi online, mở Cài đặt và kiểm tra trạng thái offline; tải lại một lần; chuyển offline và thử mở lại URL cùng trình duyệt. Lab Python và liên kết ngoài cần mạng. Bật mạng lại để cập nhật.
- [ ] Nếu dùng lab Python cũ, chạy `print(2+2)` với mạng; kỳ vọng 4. Worker sử dụng CDN Pyodide, không đảm bảo offline hoặc tương thích mọi thiết bị.

## Học và phạm vi
12 module cốt lõi (91–153 giờ ước tính) + 3 dự án (24–45 giờ) = 115–198 giờ. Đây là ước tính lập kế hoạch, không phải cam kết đủ năng lực xin việc. 149 trang gốc được phân loại và giữ ID; 77 thực hành chọn lọc, 42 tra cứu, 30 lưu trữ. Khi mâu thuẫn, ưu tiên module cập nhật. Không cần hoàn thành toàn bộ giáo trình cũ. Flashcard và kho quiz cũ chỉ bổ trợ; ôn nhanh mặc định chọn 12 câu cập nhật, ngoài ra có câu tự kiểm trong từng module.

Lab, dữ liệu, A/B và chi phí minh họa là giả lập; thuật toán xử lý chạy thật, không kết nối LLM/CRM/MCP/GA4 thực. Không đưa bí mật hoặc thông tin khách hàng thật vào bài tập. Bộ lọc quyền mô phỏng không phải bảo mật production. Các chương trình Python/SQL tải về chạy tùy công cụ; không có SQL engine nhúng. Học thêm nền tảng và xây sản phẩm thật khi cần chuyên môn sâu.

## Dữ liệu và chi phí
Dữ liệu vẫn dùng khóa `t30.*` trên localStorage để tương thích bản cũ, chỉ trên cùng origin/trình duyệt. Không đồng bộ thiết bị. Website khác cùng origin không nên dùng cùng tiền tố. Backup v2 chứa 14 nhóm, hỗ trợ nhập v1 và v2, giới hạn file 5 MiB; nếu vượt quota có thể chỉ nạp vào RAM, hãy xem cảnh báo và xuất backup. Không cần API trả phí để học trên website. Công cụ bên ngoài có điều khoản/hạn mức riêng. Không chạy mã Python chưa kiểm tra; Worker không phải sandbox bảo mật đầy đủ.

## Kiểm thử
Xem `PROJECT_STATUS.md` phần 2.7.0. Đã chạy kiểm thử logic, DOM Chromium với bộ nhớ mô phỏng, xuất Blob, tất cả 165 route, 12 module ở 390px, search/catalog, ôn tập và nhập sao lưu. Chưa kiểm tra trực tiếp deployment, localStorage bền qua reload, tải file thật, Service Worker, CDN, Safari/iOS/Android hoặc mọi liên kết ngoài. Kho cũ đã phân loại và sửa rủi ro chọn lọc, không khẳng định mọi câu cũ đều được xác minh. Xem nguồn trong từng module. 
