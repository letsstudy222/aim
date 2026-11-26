# Rubric capstone AIM (tự đánh giá, không phải chứng chỉ)

Chọn một dự án chính. Chấm mỗi nhóm 0 nếu không có, nửa điểm nếu có nhưng chưa kiểm chứng, toàn điểm nếu minh chứng tái kiểm tra được. Mốc gợi ý 80/100, đồng thời đáp ứng mọi điều kiện bắt buộc. Người học tự lưu điểm và minh chứng ở ghi chú portfolio, website không tự chấm chất lượng sản phẩm.

| Nhóm | Tối đa | Minh chứng cần có |
|---|---:|---|
| Yêu cầu và dữ liệu | 20 | Bài toán, phạm vi, schema, giả định, nguồn dữ liệu |
| Kỹ thuật tái lập | 25 | Mã/workflow chạy lại được, hướng dẫn, cấu hình mẫu |
| Kiểm thử và đối soát | 25 | Ca bình thường và lỗi, expected/actual, log, số đo với mẫu số |
| An toàn và vận hành | 20 | Quyền, duyệt, bí mật, dừng/rollback, giới hạn và chi phí |
| Giao tiếp/bàn giao | 10 | README, demo, kết luận và điều chưa xác minh |

## 01 Lead intake
- Ít nhất 20 ca, gồm thiếu trường, trùng, timeout trước/sau ghi, phân loại không chắc, không được phép. Dùng và mở rộng bộ webhook-events, workflow-cases, llm-lead-cases.
- Gate: không tạo trùng; không ghi khi sai dữ liệu/quyền; đối soát timeout sau ghi; không gửi bên ngoài. Human review cho trường hợp bất định. Không gọi mô phỏng là tích hợp thật.
- Minh chứng: code/workflow, 20 expected/actual, log, phép đo baseline cùng đầu vào (kể cả người duyệt), chi phí, sơ đồ.

## 02 Trợ lý tài liệu
- Ít nhất 20 câu, gồm đồng nghĩa, nhiều ý, ngoài phạm vi, prompt injection, quyền hạn. Mở rộng rag-cases; ghi nguồn đúng trước khi chạy.
- Gate: không bịa nguồn, không lộ dữ liệu hạn chế theo mô hình quyền đã định, không làm theo lệnh trong tài liệu, báo thiếu dữ kiện. Nếu chỉ là retrieval thì không báo điểm chatbot.
- Minh chứng: corpus giả lập có metadata, retrieval eval riêng, answer eval riêng (nếu có sinh câu), kết quả theo ca, lỗi và cách cải tiến. Không dùng dữ liệu bí mật.

## 03 CRM và growth
- Nối leads-clean, orders, channel-costs; tính theo nguồn, mô tả attribution và cohort. Test đơn trùng, lead thiếu, chi phí âm, mẫu số 0.
- Gate: đúng 8 lead, 3 người mua, 4 đơn, 1.150.000đ doanh thu, 400.000đ chi phí. CAC chỉ theo giả định khách mới; ROAS email/organic N/A. Không khẳng định quan hệ nhân quả hoặc tự tăng ngân sách.
- Minh chứng: truy vấn/code/công thức, report đối soát, đề xuất thử nghiệm có chỉ số chính, guardrail, quy tắc dừng và giới hạn mẫu.

## Mẫu tự chấm
Dự án: __; ngày: __; version: __.
Yêu cầu __/20; kỹ thuật __/25; kiểm thử __/25; an toàn __/20; bàn giao __/10.
Tổng __/100. Gate đạt/chưa đạt: __. Bằng chứng: __. Việc chưa xác minh: __. Bước tiếp theo: __.
