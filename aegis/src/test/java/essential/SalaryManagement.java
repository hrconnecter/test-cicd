package essential;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class SalaryManagement {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        driver.get("https://app.aegishrms.com");
        System.out.println("=========================================================");
        System.out.println("SALARY MANAGEMENT");
    }

    @Test
    public void salaryManagement() throws InterruptedException {
        login("automationscripts@gmail.com", "Pass@123");
        System.out.println("Login successful");

        navigateToSalaryManagement();

        manageSalary("employee", "15000", "0", "0", "1000", "0", "0", "0", "300");
        System.out.println("Salary management completed successfully");

        calculateSalary();
        System.out.println("Salary calculated and PDF downloaded successfully");

        logout();
        System.out.println("Logout successful");
    }

    private void login(String email, String password) throws InterruptedException {
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Login']")).click();
    }

    private void logout() throws InterruptedException {
        Thread.sleep(3000);
        driver.findElement(By.id("basic-button")).click();
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
    }

    private void navigateToSalaryManagement() throws InterruptedException {
        driver.findElement(By.linkText("Go To Organisation")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Payroll']")).click();
        driver.findElement(By.xpath("//h1[text()='Salary Management']")).click();
    }

    private void manageSalary(String employeeName, String basic, String hra, String conveyance, String specialAllowance, String medical, String lta, String bonus, String deductions) throws InterruptedException {
        driver.findElement(By.xpath("//input[@placeholder='Search Employee']")).sendKeys(employeeName + Keys.ENTER);
        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='MoreVertIcon']")).click();
        driver.findElement(By.xpath("//li[text()='Manage Salary']")).click();

        // Clear and update salary fields
        driver.findElement(By.name("Basic")).sendKeys(Keys.CONTROL + "a");
        driver.findElement(By.name("Basic")).sendKeys(Keys.BACK_SPACE);
        driver.findElement(By.name("Basic")).sendKeys(basic + Keys.TAB + hra + Keys.TAB + conveyance + Keys.TAB + specialAllowance 
                + Keys.TAB + medical + Keys.TAB + lta + Keys.TAB + bonus + Keys.TAB + deductions);
        Thread.sleep(3000);
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
        Thread.sleep(2000);
    }

    private void calculateSalary() throws InterruptedException {
        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='MoreVertIcon']")).click();
        driver.findElement(By.xpath("//li[text()='Calculate Salary']")).click();
        Thread.sleep(3000);
        driver.findElement(By.xpath("//input[@type='month']")).sendKeys(Keys.ARROW_DOWN , Keys.ARROW_RIGHT , Keys.ARROW_DOWN);
        Thread.sleep(3000);

        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        driver.findElement(By.xpath("//button[text()='Download PDF']")).click();
        Thread.sleep(10000);
    }

    @AfterClass
    public void teardown() throws InterruptedException {
        if (driver != null) {
            Thread.sleep(3000);
            System.out.println("=========================================================");
            driver.quit();
        }
    }
}
