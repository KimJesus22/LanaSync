import { test, expect } from '@playwright/test';

test('Critical Path: Login and Add Expense', async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // 2. Login (Mocking or using test credentials)
    // For this test, we'll assume the user needs to login. 
    // Since we don't have a real backend in this E2E environment easily without seeding,
    // we might hit the login page.
    // However, if the app checks session on load, it might redirect to /login.

    // Let's assume we are on the login page or need to click login.
    // If the app is protected, it should redirect to login.

    // NOTE: This test assumes a "test@example.com" user exists with "password123".
    // In a real CI environment, you would seed the DB before running tests.

    // Check if we are on login page by looking for "Iniciar Sesión" or similar
    // Adjust selectors based on actual UI
    // await page.getByPlaceholder('Correo electrónico').fill('test@example.com');
    // await page.getByPlaceholder('Contraseña').fill('password123');
    // await page.getByRole('button', { name: 'Iniciar Sesión' }).click();

    // Wait for Dashboard
    // await expect(page.getByText('Saldo Total')).toBeVisible();

    // 3. Add Expense
    // Click FAB
    await page.getByRole('button', { name: 'Agregar Transacción' }).click();

    // Fill Form
    await page.getByPlaceholder('Monto').fill('500');
    await page.getByPlaceholder('Descripción').fill('Gasto de Prueba E2E');

    // Select Category (assuming it's a select or similar)
    // await page.getByRole('combobox').selectOption('Comida'); 
    // Or if it's our custom UI, click the category.

    // Submit
    await page.getByRole('button', { name: 'Guardar' }).click();

    // 4. Verify
    await expect(page.getByText('Gasto de Prueba E2E')).toBeVisible();
    await expect(page.getByText('$500')).toBeVisible();
});
