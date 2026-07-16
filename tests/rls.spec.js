const { test, expect, request } = require('@playwright/test');

const SUPABASE_URL = 'https://islxgvjvrxebdtihrkbq.supabase.co';
const ANON_KEY = 'sb_publishable__ogPxzJzKKighw363hqGqg_HOIQEn7A';

const PRIVATE_TABLES = [
    'student_progress',
    'exam_attempts',
    'mock_exam_attempts',
    'centralized_mock_attempts',
    'profiles',
    'favorite_questions',
    'wrong_answer_log',
];

test.describe('عزل البيانات (RLS): زائر غير مسجّل لا يقرأ بيانات الطلاب', () => {
    let api;

    test.beforeAll(async () => {
        api = await request.newContext({
            baseURL: SUPABASE_URL,
            extraHTTPHeaders: {
                apikey: ANON_KEY,
                Authorization: 'Bearer ' + ANON_KEY,
            },
        });
    });

    test.afterAll(async () => {
        if (api) await api.dispose();
    });

    test('المفتاح العام صالح وREST يعمل (ضبط تحقّق)', async () => {
        const resp = await api.get('/rest/v1/choices_public?select=id&limit=1');
        expect(resp.status(), 'المفتاح العام غير صالح أو REST لا يعمل').toBe(200);
    });

    for (const tableName of PRIVATE_TABLES) {
        test('جدول ' + tableName + ' محميّ (لا يُرجع صفوفًا لزائر غير مسجّل)', async () => {
            const resp = await api.get('/rest/v1/' + tableName + '?select=*&limit=5');
            if (resp.status() === 200) {
                const rows = await resp.json();
                const count = Array.isArray(rows) ? rows.length : 0;
                expect(count,
                    '⚠️ تسرّب أمني محتمل: الجدول "' + tableName + '" أرجع صفوفًا لزائر غير مسجّل. تحقّق من تفعيل RLS وسياساته على هذا الجدول.'
                ).toBe(0);
            } else {
                expect([401, 403]).toContain(resp.status());
            }
        });
    }
});
