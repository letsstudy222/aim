# PROJECT_STATUS — AIM 2.7.0 FINAL (bàn giao)

26/11/2026. Kế thừa ZIP 2.6, giữ 165 route, 149 trang gốc, 12 module, 3 capstone, khóa `t30.*`. Đã hoàn thành 7 giai đoạn dự án ở phạm vi bản bàn giao tĩnh. Chưa deploy tự động; cần smoke test sau upload.

## Thay đổi phát hành
- Ôn nhanh mặc định chọn từ 12 câu quiz cốt lõi, có lựa chọn kho cũ, giữ ID/thống kê lịch sử; chống chấm lặp qua bàn phím, dùng button native. Flashcard chỉnh định nghĩa context, hallucination, conversion, LTV, attribution, sửa dịch chỉ số thẻ tự tạo khi xóa; giữ index và dữ liệu cũ.
- Xuất nhật ký HTML đủ 90 ngày thay vì 30; backup v2 14 nhóm, hỗ trợ nhập v1 và v2; lọc thống kê quiz lỗi, giới hạn độ dài bằng chứng/ghi chú portfolio theo mức sao lưu. Cảnh báo nếu đọc lưu trữ lỗi. Không cam kết ghi dữ liệu nguyên tử khi localStorage đầy.
- Search: trạng thái aria-expanded, mở phần chi tiết có kết quả, xử lý chuỗi tìm kiếm; menu aria-expanded, Escape, aria-current, focus-visible, hashchange; hiệu chỉnh hiển thị. Không phải audit WCAG đầy đủ.
- Phiên bản 2.7.0 nhất quán ở tiêu đề, sidebar, settings, roadmap; query version cho JS/CSS/worker, cache v2.7 và đọc cache theo phiên bản, giảm nguy cơ dùng lẫn tài nguyên cũ/mới. SW chưa được kiểm tra end-to-end.

## Kiểm thử đã chạy trong lượt này
- Node --check tất cả JS/SW; Python unittest 11/11; SQLite 4 truy vấn; Agent 16/16, eval metrics/gates/fixture; Marketing 13/13.
- Chromium DOM nạp trực tiếp HTML/CSS/JS (localStorage và history mô phỏng): 165 route, tiến độ legacy 3/90; lab webhook, workflow 10/10, LLM validator 14/14, RAG 12/15 top1 và 13/15 top2, Agent 16/16, Evals, marketing, export Blob; 12 module mở chi tiết ở 390px và portfolio không tràn ngang. Catalog 149 link, mở d23 và lịch sử, search ưu tiên module mới đạt.
- Kiểm thử phát hành riêng: hoàn thành a01 với checklist/quiz/bằng chứng; xuất backup 14 nhóm, từ chối v1 lỗi và giữ tiến độ, nhập v1/v2, xuất nhật ký 90 ngày chứa ngày 90; flashcard Enter và xóa thẻ tự tạo không lệch trạng thái; ôn 5 câu core đúng 5/5 bằng phím, chống chấm lặp, chuyển kho cũ; search bằng phím; menu mobile/Escape và catalog/history. Không pageerror. Kiểm thử tĩnh ID, liên kết, cache, dung lượng.
- Hạn chế: môi trường Chromium báo ERR_BLOCKED_BY_ADMINISTRATOR với localhost và cả URL thử giả lập; chưa xác minh localStorage thật qua reload, SW/offline, tải file thực, Python CDN, thiết bị/trình duyệt thật, GitHub Pages sau deploy, mọi liên kết ngoài hoặc mọi tương tác cũ. Không coi lab giả lập là triển khai hệ thống thật. Không kiểm chứng từng câu của 149 trang cũ. Không có tuyên bố đảm bảo nghề nghiệp.

## Bước tiếp theo
Người dùng upload ZIP FINAL theo README, kiểm tra smoke test trên URL thật. Nếu có lỗi, sửa từ bản này, giữ ID và backup; không xóa dữ liệu trình duyệt. Duy trì rà soát nội dung/nguồn định kỳ, chỉ bổ sung công nghệ khi có giá trị.

## Lịch sử phát triển (các đoạn cũ phản ánh trạng thái ở từng phiên bản)

# PROJECT_STATUS — AIM 2.6.0 (bản phát triển, CHƯA FINAL)

- 26/11/2026. Kế thừa AIM 2.5, giữ 165 trang, ID và dữ liệu tiến độ. Đã phân loại toàn bộ 149 trang legacy theo ID, tiêu đề và chủ đề: 77 thực hành chọn lọc, 42 tra cứu tùy nhu cầu, 30 lưu trữ không theo nguyên văn. Mỗi trang có ghi chú và đường dẫn module cập nhật. 28 trang lịch sử thu gọn, có thể mở lại; không xóa các trang hay tiến độ. Inventory tại practice/LEGACY_REVIEW.csv, mục kho tham khảo trên roadmap. Đây là phân loại và sửa điểm rủi ro nổi bật, không phải kiểm chứng từng câu, từng quiz và mọi link ngoài.
- Sửa lỗi roadmap 2.5 ghi 10/12; cả 12 module đã mở rộng. Thời lượng mới 91–153 giờ cho 12 module, 24–45 giờ bổ sung cho 3 dự án mô phỏng, tổng 115–198 giờ; ước tính lập kế hoạch, không phải đo thực nghiệm hay cam kết nghề nghiệp. Học theo năng lực, không bắt buộc chứng chỉ, thu nhập, công cụ, công khai hay mốc 36 tháng. Sửa yêu cầu nạp tiền API ở d23, cảnh báo OAuth d9/book, một số khẳng định thu nhập và offline. Các mốc/câu chữ cũ còn trong phần lịch sử, không coi là hướng dẫn hiện hành.
- Đối chiếu chọn lọc n8n Cloud FAQ (trial và tải workflow), n8n Sustainable Use License, HubSpot Academy, GitHub xử lý secret bị lộ. Không cam kết mọi link còn hoạt động; giấy phép/giá thay đổi. Search ưu tiên module mới, gắn nhãn kho cũ; danh mục có đủ 149 liên kết. Cache nâng v2.6 và thêm CSV.
- Kiểm thử: Node syntax, marketing 13/13, Agent 16/16 + eval, Python 11/11, SQL 4 truy vấn, Chromium DOM 165 route và 12 module 390px, lab cũ và tiến độ mô phỏng đạt sau khi thêm cảnh báo và thu gọn lịch sử. Sau chỉnh sửa nhỏ tiếp theo (nút home tới catalog, câu chữ), kiểm tra tĩnh ID, 149 liên kết, CSV, asset/cache, cú pháp đạt. Bộ kiểm thử thao tác catalog/search bổ sung hết thời gian, chưa xác nhận toàn bộ thao tác mới trong trình duyệt. Chưa xác minh offline, CDN Python, GitHub Pages, trình duyệt thiết bị thật, tải file thật và tích hợp hệ thống thật.

## Tiếp theo — giai đoạn 7
- Kiểm thử catalog/search và điều hướng thực, khả năng tiếp cận, backup/localStorage, responsive, offline/SW và download nếu môi trường cho phép. Kiểm tra các quiz/flashcard cũ có nhãn lịch sử rõ; rà soát những nội dung nguy cơ cao còn sót. Sửa lỗi và đóng gói FINAL; smoke test trên URL thật sau khi người dùng upload. Không phát hành tự động.

## Lịch sử

# PROJECT_STATUS — AIM 2.5.0 (bản phát triển, CHƯA FINAL)

- Ngày 26/11/2026. Kế thừa AIM 2.4.0; giữ 165 trang, toàn bộ ID và cấu trúc dữ liệu tiến độ cũ. Module 01–12 đều đã mở rộng, 149 trang legacy chưa rà soát từng trang. Thời lượng 60–94 giờ vẫn là ước tính cũ, cần hiệu chỉnh.
- Module 11: CRM, snapshot vs funnel, cohort, join đúng grain, CAC/ROAS/biên đóng góp, attribution vs incrementality, thử nghiệm và guardrail, AI diễn giải có kiểm chứng. 6 câu tự kiểm. Module 12: các nhóm nghề, tín hiệu thị trường VN/quốc tế có nguồn ngày kiểm tra, phương pháp khảo sát 10–20 tin (mẫu trống, không khảo sát tin riêng lẻ trong lượt này), README, tiếng Anh chuyên ngành, demo/bàn giao, 6 câu tự kiểm. 3 capstone có yêu cầu, gate, rubric 100 điểm tự chấm; giữ 3 ô ghi chú và checkbox cũ, không tự động chấm.
- Thêm js/marketing-fixtures.js + js/marketing.js và practice/channel-costs.csv, test_marketing.js, job-research.csv, CASE_STUDY_TEMPLATE.md, CAPSTONE_RUBRIC.md. Fixture marketing đồng bộ leads-clean.csv/orders.csv/channel-costs.csv; tất cả dữ liệu giả lập. Lab 12 dùng 8 lead, 4 đơn, 3 người mua, 1.150.000đ doanh thu, 400.000đ chi phí thu hút (200.000đ quảng cáo). Giả định mọi người mua mới, doanh thu quy nguồn lead, kỳ quan sát chung không có ngày đơn, không hoàn tiền; tổng CAC giả định 133.333,33đ. ROAS ads 2,5, hai kênh không chi ads N/A; tổng doanh thu/chi ads không phải ROAS ads. Biên đóng góp trước thu hút 35% → 2.500đ; 20% → -170.000đ; không phải lợi nhuận ròng. Lab chạy JS, không kết nối CRM/GA4/LLM, không đo causal impact.
- Nguồn: Google Analytics attribution, Microsoft Research experimentation, ITviec Q3/2026 (dữ liệu nền tảng), ManpowerGroup Q4/2026 (ý định tuyển 285 doanh nghiệp Việt Nam), WEF 2025 (khảo sát quốc tế). Không dự báo thu nhập hoặc xác suất xin việc. URL trong bài. Không khẳng định đã khảo sát tin tuyển dụng riêng lẻ; cung cấp mẫu cho người học tự cập nhật.
- Kiểm thử: node --check toàn bộ JS/SW, 13/13 test marketing, chạy lại test_ops.js đạt. Chromium DOM nạp trực tiếp với localStorage mô phỏng: 165 route không pageerror, tiến độ legacy 3/90, lab API/workflow/LLM/RAG/Agent/Evals cũ, báo cáo marketing và export JSON ở 35% và 20% đạt, thay đầu vào vô hiệu export cho tới khi tính lại; 12 module mở chi tiết và portfolio ở 390px không tràn ngang. Kiểm tra ID cũ, liên kết nội bộ, cache list và ZIP. Chưa xác minh GitHub Pages, tải file thật, localStorage thật, offline/SW, Python CDN, thiết bị thật, kết nối hệ thống/LLM thật.

## Tiếp theo (lộ trình hiện hành)
1. Rà soát 149 trang legacy: lập inventory theo ID; phân loại giữ/học thêm/cảnh báo lỗi thời; ưu tiên sửa lời hứa thu nhập, khóa cứng công cụ, kiến thức dễ sai, link/tài liệu; giữ ID và tiến độ. Không gọi là kiểm chứng toàn bộ nếu chỉ phân loại. Hiệu chỉnh thời lượng và trình tự theo mức độ người mới; có thể chia nhiều lượt.
2. Kiểm thử hồi quy, accessibility/mobile, backup, offline và tải thực nếu môi trường cho phép; đóng gói FINAL, smoke test URL thật sau khi người dùng upload.

## Lịch sử

# PROJECT_STATUS — AIM 2.4.0 (bản phát triển, CHƯA FINAL)

- Ngày 26/11/2026. Kế thừa ZIP AIM 2.3.0; giữ 165 trang và mọi ID cũ, cấu trúc tiến độ, backup và lab trước. Module 01–10 đã mở rộng; 11–12 vẫn tổng quan 2.0. Thời lượng 60–94 giờ còn là ước tính cũ, cần hiệu chỉnh cuối.
- Module 09: workflow hay agent, function/tool calling, schema, quyền đối tượng, phiếu duyệt chính xác dùng một lần, MCP host/client/server, giới hạn và timeout, 6 câu tự kiểm. Module 10: test/eval, dev/held-out, slice, p95, so sánh cùng ca, chi phí/ca đạt, gate, bảo mật, canary/monitoring/rollback, 6 câu tự kiểm. Nguồn chính thức OpenAI function calling/evals, MCP SDK/spec 2026-07-28, OWASP 2026, NIST AI 600-1; URL trong bài. Không đòi mua API hoặc học thuộc SDK.
- Thêm js/ops-fixtures.js + js/ops-practice.js, practice/agent-policy-cases.json (16 ca), eval-comparison.json (24 ca), RELEASE_CHECKLIST.md, test_ops.js. Dữ liệu JSON và JS fixture đồng nhất; sửa cả hai nếu đổi dữ liệu. Lab Agent: danh tính L01 dựng sẵn, order_id/owner từ orders.csv, allowlist hai tool, schema, đối tượng, duyệt chính xác một lần trong RAM, tối đa 3 lượt, 1 credit/lượt giả định, dừng khi timeout. Không thực thi hành động bên ngoài, không có auth thật, MCP server, LLM, token, expiry, concurrency hoặc lưu bền. Mã trạng thái nội bộ phân biệt denied/not_found để học; production cần tránh lộ tồn tại đối tượng. Không có cơ chế bảo mật thật ở frontend.
- Lab eval: 24 ca giả lập (normal/missing/security/failure, mỗi nhóm 6), actual/critical/token/latency dựng sẵn. A 22/24, 0 critical, p95 1163 ms, 9.15 USD/10.000; B 23/24, 1 critical, p95 1769 ms, 14.70 USD/10.000. Giá giả định 1 USD/M input, 3 USD/M output; chỉ token, không phải báo giá hay phép đo model thật. Ngưỡng mặc định 90% tổng, 80% nhóm, 0 critical, 10 USD; A đạt điều kiện lab, B bị chặn. Hai ca B cải thiện (E06/E14), một hồi quy (E13). Có thể đổi ngưỡng, xuất báo cáo JSON. Không dùng làm benchmark production.
- Kiểm thử Node: 16/16 ca policy đúng kỳ vọng; chỉ 2 bản nháp toàn bộ 16 ca (A05/A07, mỗi kịch bản riêng), kiểm tra invalid reason, đồng bộ fixture, metrics/gate, dữ liệu rỗng/trùng và ngưỡng sai, cost per pass không có mẫu đạt. Node --check toàn bộ JS/SW. Chromium DOM nạp trực tiếp HTML/CSS/JS với localStorage mô phỏng: 165 route không pageerror sau sửa xung đột form cũ (labs.js chỉ lắng nghe form[data-lab]), tiến độ 3/90, lab webhook/workflow/LLM/RAG cũ, lab agent chọn/chạy/đổi ca/xuất Blob, eval đổi ngưỡng và xuất Blob, 10 module mở chi tiết không tràn ngang ở 390px. Kiểm tra ID, file/link nội bộ, cache manifest và ZIP. Chưa xác minh tải thực, localStorage thật, GitHub Pages, offline/SW, Python CDN, thiết bị thật, MCP/LLM/API/CRM thật.

## Tiếp theo (lộ trình hiện hành)
1. Module 11–12: marketing analytics/CRM/Growth, portfolio, tín hiệu tuyển dụng Việt Nam/quốc tế, tiếng Anh chuyên ngành, 3 capstone có rubric.
2. Rà soát 149 trang legacy, phân loại giữ/học thêm/lỗi thời; cập nhật nguồn, thời lượng và trình tự; giữ dữ liệu cũ.
3. Kiểm thử hồi quy, accessibility/mobile, backup, offline và tải thực nếu môi trường cho phép; đóng gói FINAL, smoke test URL thật sau khi người dùng upload.

## Lịch sử

# PROJECT_STATUS — AIM 2.3.0 (bản phát triển, CHƯA FINAL)

- Ngày 26/11/2026. Kế thừa AIM 2.2.0; giữ 165 trang và tất cả ID cũ, tiến độ, backup và lab trước. Module 01–08 đã mở rộng, module 09–12 vẫn là tổng quan 2.0. Giai đoạn 4 chia thành 4A (LLM/RAG) và 4B (agent/evals). Thời lượng cũ 60–94 giờ chưa hiệu chỉnh.
- Module 07: token/context, chọn code hay LLM, structured output/schema, phân loại lead và review, tách kiểm tra cú pháp/cấu trúc/evidence/nhãn, đo chất lượng và chi phí. Module 08: RAG, chunk/metadata, từ khóa/embedding/hybrid, lọc trạng thái/quyền, retrieval và generation eval. Thêm 12 câu tự kiểm có đáp án và hướng dẫn thực hành cho người mới.
- Thêm 5 file dữ liệu JSON giả lập: lead-output-schema, llm-lead-cases (15 tin nhắn), llm-validation-cases (14 fixture), rag-chunks (8 đoạn, 5 công khai đã duyệt), rag-cases (15 câu). js/ai-fixtures.js nhúng cùng dữ liệu để chạy không cần fetch; js/ai-practice.js chứa validator chuyên biệt và truy xuất theo số token trùng, giao diện lab có xuất báo cáo JSON. Nếu chỉnh JSON cần cập nhật cả JS fixture tương ứng. Không gọi LLM thật, không dùng embedding hoặc vector DB, không cấp quyền thật, không gọi CRM, không lưu dữ liệu lab. Bộ lọc minh họa, tất cả dữ liệu tĩnh công khai; không chứa bí mật. Schema validator có kiểm tra nghiệp vụ bổ sung (chuỗi trắng, evidence, nhãn tham chiếu); không phải thư viện JSON Schema đầy đủ. Bộ test nhỏ dùng học, không suy rộng chất lượng mô hình.
- Kiểm thử Node: 14/14 fixture validator đúng kỳ vọng; truy xuất top-1 12/15, top-2/top-3 13/15. Hai ca đồng nghĩa chưa tìm thấy; top-1 còn thiếu nguồn câu nhiều ý. Top-2 lọc 0/15 ca truy xuất nguồn không được phép, đối chứng không lọc 10/15 (không hiển thị nội dung). Không phải điểm chatbot hay chứng minh bảo mật thật. Node --check toàn bộ JS/SW đạt.
- Chromium DOM: nạp mã trực tiếp và localStorage mô phỏng; 165 route không pageerror, tiến độ 3/90, lab webhook/workflow cũ đạt, thao tác chọn mẫu/dán JSON/chạy fixture/xuất Blob mới đạt; RAG tìm nguồn, câu không tìm được, top-1/top-2 và xuất Blob đạt; 8 module mở phần chi tiết tại 390px không tràn ngang. ID từ 2.0 giữ nguyên, không trùng, link thực hành và asset nội bộ kiểm tra tồn tại. Chưa xác minh thực tế GitHub Pages, offline/SW, Python CDN, download thật, trình duyệt thật ngoài Chromium hoặc LLM/API/CRM thật.
- Nguồn chính thức đối chiếu: OpenAI structured outputs, JSON Schema object, Microsoft Learn RAG và RAG evaluation, OWASP prompt injection 2026 (URL trong bài).

## Tiếp theo (lộ trình hiện hành)
1. Module 09–10: tool calling, agent, MCP, quyền tối thiểu và phê duyệt; evals, bảo mật, vận hành, tối ưu chi phí, test với dữ liệu Mây và phân biệt mô phỏng/model thật.
2. Module 11–12: marketing analytics/CRM/Growth, portfolio, tín hiệu tuyển dụng Việt Nam/quốc tế, tiếng Anh chuyên ngành, 3 capstone có rubric.
3. Rà soát 149 trang legacy, phân loại giữ/học thêm/lỗi thời; cập nhật nguồn, thời lượng và trình tự; giữ dữ liệu cũ.
4. Kiểm thử hồi quy, accessibility/mobile, backup, offline và tải thực nếu môi trường cho phép; đóng gói FINAL, smoke test URL thật sau khi người dùng upload.

## Lịch sử (các lộ trình cũ đã được thay thế bởi mục trên)

# PROJECT_STATUS — AIM 2.2.0 (bản phát triển, CHƯA FINAL)

- Ngày 26/11/2026. Xuất phát từ ZIP AIM 2.1.0, giữ 165 trang, mọi ID cũ, dữ liệu và cơ chế sao lưu. Module 01–06 đã mở rộng. Module 07–12 vẫn ở dạng tổng quan 2.0; thời lượng tổng cần hiệu chỉnh sau khi hoàn thiện.
- Giai đoạn kỹ thuật: module 05 (automation chịu lỗi, retry, idempotency, đối soát, logging, n8n tùy chọn), module 06 (Python thực dụng, AI coding, đọc diff, test, Git, rollback). Thêm 10 câu tự kiểm có đáp án và tiêu chí nghiệm thu. Không yêu cầu mua API, không bắt buộc học sâu thao tác công cụ. 
- 4 tệp thực hành mới: workflow-cases.json, clean_leads.py, test_clean_leads.py, REVIEW_TEMPLATE.md. Lab workflow tích hợp js/workflow.js dùng 10 ca giả lập cố định, tuần tự trong RAM, không mạng hoặc CRM thật; export log JSON. Chưa hỗ trợ concurrency, lưu trữ bền vững hoặc xác thực thật. Python chạy cục bộ bằng Python 3.10+; chỉ thư viện chuẩn. Kịch bản không ghi đè nguồn; file my-* đầu ra có thể ghi đè khi chạy lại. Không tự động đồng bộ GitHub hay n8n.
- Kiểm thử: Node --check toàn bộ JS/SW; 11 unit test Python đạt, đầu vào 11 dòng, giữ 8, loại 3, CSV đầu ra khớp file đáp án. Chromium DOM (nạp trực tiếp mã, localStorage mô phỏng): 165 route không pageerror; tiến độ legacy 3/90; lab webhook cũ đạt; lab workflow 10/10, 4 bản ghi nháp, 9 lần ghi thử, reset và chạy lại đúng, export Blob kiểm tra nội dung JSON; 6 module mở các phần chi tiết ở viewport 390px không tràn ngang. Các ID cũ còn nguyên, không trùng ID, liên kết file nội bộ hợp lệ. Chưa xác minh download thật, Service Worker/offline, Python CDN, n8n thật, GitHub Pages hoặc thiết bị thật. Không tuyên bố mô phỏng là hệ thống production.
- Nguồn đối chiếu: tài liệu chính thức Python tutorial/errors/unittest, n8n executions/security audit, GitHub flow/push protection. URL trong bài, nội dung thực hành tự biên soạn.

## Tiếp theo (theo thứ tự)
1. Module 07–10: structured outputs, RAG, agent, evals, bảo mật và chi phí; tạo bộ dữ liệu và lab có kiểm chứng, phân biệt mô phỏng với mô hình thật. Có thể chia thành 07–08 và 09–10 nếu cần chiều sâu.
2. Module 11–12: marketing analytics/CRM/Growth, portfolio; nghiên cứu nhu cầu việc làm VN/quốc tế; hoàn thiện 3 capstone với rubric và minh chứng.
3. Rà soát 149 trang legacy, phân loại giữ/học thêm/lỗi thời, kiểm chứng nội dung và liên kết, hiệu chỉnh thời lượng, giữ nguyên ID và dữ liệu.
4. Kiểm thử hồi quy, accessibility/mobile, backup, tải thật/offline nếu có môi trường; đóng gói FINAL và smoke test URL thật sau khi user upload.

## Lịch sử bản 2.1 và 2.0 (tham chiếu, lộ trình trên thay thế các bước cũ)

# PROJECT_STATUS — AIM 2.1.0 (bản phát triển, CHƯA FINAL)

- Ngày: 26/11/2026. Xuất phát từ ZIP AIM 2.0.0, giữ nguyên 165 trang và ID, 149 trang cũ, cơ chế lưu tiến độ và backup.
- Hoàn thành giai đoạn nền tảng: mở rộng module 01–04 (tư duy AI/kinh doanh, kiểm chứng AI, dữ liệu/SQL, API/webhook). Mỗi module có kiến thức từ đầu, tình huống cửa hàng Mây hư cấu, bài tập có đáp án, 4 câu tự kiểm, nguồn đọc thêm. Không thay đổi tiêu chí hoàn thành cũ, không xóa tiến độ. Thời lượng 60–94 giờ của bản 2.0 chỉ còn là ước tính cũ; cần điều chỉnh cuối quá trình.
- Thêm 10 tệp thực hành: baseline, policy, AI eval cases, leads raw/clean, orders, SQLite setup/queries, Python runner, webhook events. Toàn bộ dữ liệu giả lập. Lab webhook mô phỏng nội bộ, không gọi mạng, không có API key; kiểm tra 201/200/400/409, giới hạn và reset. Không phải server webhook thật. SQL chạy bằng SQLite/Python tùy công cụ người học, không có SQL engine mới nhúng trong web.
- Kiểm thử 2.1: Node --check toàn bộ JS và SW; SQLite thực thi bốn truy vấn, đối chiếu kết quả; Python runner chạy thành công; 165 trang điều hướng không phát sinh pageerror trong Chromium DOM; 4 module mở toàn bộ chi tiết ở 390px không tràn ngang; tiến độ 3 ngày legacy đọc được từ bộ nhớ mô phỏng; lab webhook nhận mới, trùng, thiếu trường, JSON lỗi, xung đột và reset đạt. Kiểm tra tất cả ID không trùng và link file thực hành nội bộ tồn tại. Service worker tăng phiên bản và thêm cache tài nguyên mới, chưa kiểm tra offline thật. Chưa kiểm thử download qua GitHub Pages hoặc thiết bị thật. Nội dung chatbot cần người học thực hành bằng mô hình bên ngoài, chưa kiểm thử 10 ca với một LLM thật.
- Nguồn bổ sung: Microsoft Learn (generative AI, LLM fundamentals); NIST AI RMF; SQLite SELECT; MDN HTTP, GitHub webhook best practices. Các URL được ghi ngay trong bài; các bài tập và đáp án là nội dung tự biên soạn.

## Lộ trình còn lại (không coi bản này là bản phát hành cuối)
1. Module 05–06: automation, AI coding, Git, Python thực dụng, tạo workflow có test và log; tiếp tục tình huống Mây.
2. Module 07–10: structured outputs, RAG, agent, evals, bảo mật, chi phí; bổ sung bộ test và project thực hành miễn phí, phân biệt lab mô phỏng với hệ thống thật.
3. Module 11–12: marketing analytics/CRM, portfolio; nghiên cứu tín hiệu tuyển dụng Việt Nam và quốc tế, rà soát các kỹ năng dễ lỗi thời; hoàn thiện 3 capstone với rubric và minh chứng.
4. Rà soát từng trang legacy: phân loại giữ/học thêm/lỗi thời, kiểm chứng nguồn và đường dẫn, chỉnh lại thời lượng và trình tự; bảo toàn dữ liệu người học.
5. Kiểm thử hồi quy và dữ liệu, accessibility/mobile, backup, tải thực, offline (khi có môi trường), kiểm tra giới hạn GitHub Pages. Đóng gói bản final; smoke test trên URL thực tế sau khi user upload.

## Lịch sử bản 2.0 (tham chiếu, các mục bước tiếp theo cũ đã được thay bằng lộ trình trên)

# PROJECT_STATUS — AIM

- Phiên bản: 2.0.0 · 26/11/2026
- Gốc: aim-main.zip, commit ghi trong ZIP cbd0c1e392e90dc94150f2253f360d5731aae9e5.
- Mục tiêu: người mới học AI ứng dụng kết hợp dữ liệu, tự động hóa, marketing, vận hành và portfolio. GitHub Pages, không phát sinh chi phí bắt buộc.
- Kiến trúc: HTML tĩnh giữ 149 trang cũ + 16 trang mới (dashboard, roadmap, 12 module, portfolio, settings); CSS/JS tách file. Không cần build. Nội dung HTML vẫn được giữ cùng index để bảo toàn simulator và deep link; chưa tách hết giáo trình thành dữ liệu JSON.
- Tính năng mới: dashboard, lộ trình cốt lõi 12 module 60–94 giờ ước tính, 36 bài thực hành, 12 quiz, 5 lab chạy local, 3 đề bài capstone, checklist và bằng chứng, điều hướng có nhóm, giao diện responsive.
- Sửa lỗi: tiến độ và nhắc sao lưu 90 ngày; timer theo deadline; kiểm tra dữ liệu backup v1/v2; xuất 14 nhóm dữ liệu; lưu tạm trong RAM nếu localStorage lỗi; escape ghi chú/thẻ; biểu thức dùng interpreter hạn chế; Python Worker có giới hạn thời gian; service worker và manifest.
- Bảo toàn: 149 ID trang gốc, 90 ID ngày, tiền tố `t30.`; legacy pages gắn cảnh báo. Chưa thẩm định từng dòng giáo trình cũ hoặc toàn bộ link bên ngoài. Các dự báo thu nhập, tên công cụ và hướng dẫn cũ không được coi là hiện hành.

## Kiểm thử 26/11/2026
- Node --check toàn bộ JS: đạt.
- Đối chiếu 149 ID gốc và 165 trang hiện tại; kiểm tra ID trùng, data-jump/goto, đường dẫn asset nội bộ.
- Chromium DOM kiểm thử với HTML/CSS/JS được nạp trực tiếp vào trang trống và localStorage mô phỏng (chính sách trình duyệt chặn điều hướng localhost): không lỗi JS khi gọi 165 route; dashboard đọc 3 ngày cũ; tiến độ cốt lõi xác nhận sau checklist/quiz/bằng chứng; nhập v1 hợp lệ và từ chối v1 sai; export Blob mô phỏng đủ 14 nhóm và import v2; 8/8 biểu thức mẫu; timer kết thúc theo deadline; 5 lab chạy với dữ liệu mẫu; mobile 390px không tràn trang chủ/roadmap; điều hướng mobile đạt. Desktop 1440px kiểm tra ảnh giao diện.
- Chưa kiểm thử trực tiếp trên GitHub Pages sau deploy, localStorage trình duyệt thật qua tải lại, thao tác download thực, Safari/iOS, mọi nút của giáo trình cũ, chạy Python CDN và service worker offline end-to-end. Không khẳng định các phần này đã đạt.

## Nguồn định hướng
WEF Future of Jobs 2025: https://www.weforum.org/publications/the-future-of-jobs-report-2025/3-skills-outlook
LinkedIn 2026: https://news.linkedin.com/2026/linkedin-data-shows-where-opportunity-is-emerging-as-work-changes
PwC AI Jobs Barometer 2026: https://www.pwc.com/gx/en/news-room/press-releases/2026/pwc-2026-ai-jobs-barometer.html
AMA State of Marketing Careers 2026: https://www.ama.org/marketing-news/2026-career-report/
OpenAI agent guide: https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
Các báo cáo là tín hiệu quốc tế, không phải dự báo tuyển dụng riêng Việt Nam. Các link tài liệu kỹ thuật trong module là hướng dẫn tra cứu; chưa kiểm tra toàn bộ URL.

## Bước tiếp theo
1. Triển khai và smoke test trên URL GitHub Pages thật, kiểm tra dữ liệu cũ, tải backup và offline.
2. Kiểm thử Python CDN và thiết bị iOS/Android thật; kiểm tra chức năng cũ quan trọng.
3. Mở rộng mỗi module thành bài học chi tiết hơn, bộ test có dữ liệu tải được và rubrics; cập nhật theo tín hiệu tuyển dụng Việt Nam/quốc tế. Tách nội dung dữ liệu riêng nếu tiếp tục mở rộng lớn.
4. Rà soát nguồn và công cụ theo quý; tăng kỹ năng có nhu cầu thực, không biến các xu hướng hoặc lộ trình 36 tháng thành lời hứa nghề nghiệp.
