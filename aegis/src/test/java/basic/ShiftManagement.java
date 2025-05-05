package basic;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

public class ShiftManagement {

    @Test
    public void shiftManagement() {
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(20));
        
        try {
            // Navigate to the application
            driver.get("https://app.aegishrms.com");
            System.out.println("=========================================================");
            System.out.println("SHIFT MANAGEMENT");

            // Login
            driver.findElement(By.name("email")).sendKeys("employee@burberry.com");
            driver.findElement(By.name("password")).sendKeys("Pass@123");
            driver.findElement(By.xpath("//button[text()='Login']")).click();
            System.out.println("Login successful");

            // Open drawer and navigate to Attendance > Shift Management
            driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
            Thread.sleep(2000);
            driver.findElement(By.xpath("//h1[text()='Attendance']")).click();
            driver.findElement(By.xpath("//h1[text()='Shift Management']")).click();

            // Raise Shift Request
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//button[@type='button'])[5]"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='08']/.."))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Submit']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@aria-haspopup='listbox']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[text()='General Shift']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Apply for shift']"))).click();
            System.out.println("Shift request raised successfully");

            // Delete Shift Request
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//button[@type='button'])[5]"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[@title='General Shift']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Delete']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Submit']"))).click();
            System.out.println("Shift request deleted successfully");

            // Logout
            wait.until(ExpectedConditions.elementToBeClickable(By.id("basic-button"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[text()=' Log out']"))).click();
            System.out.println("Logout successful");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
        	System.out.println("=========================================================");
            driver.quit();
        }
    }
}
