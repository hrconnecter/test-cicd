package enterprise;
 
import java.time.Duration;
 
import org.openqa.selenium.By;

import org.openqa.selenium.Keys;

import org.openqa.selenium.WebDriver;

import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.AfterClass;

import org.testng.annotations.BeforeClass;

import org.testng.annotations.Test;
 
import essential.BaseDriverSetup;
 
public class ExpenseManagement {
 
    private WebDriver driver;
 
    @BeforeClass

    public void setup() {

        driver = BaseDriverSetup.getDriver();

        driver.manage().window().maximize();

        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(25));

        driver.get("https://qa.aegishrms.com/sign-in");

        System.out.println("=========================================================");

        System.out.println("▶️ EXPENSE MANAGEMENT WORKFLOW");

    }
 
    @Test

    public void expenseworkflow() {

        try {

            login("qatest@gmail.com", "Pass@123");

            createExpense();

            login("manager1@gmail.com", "Pass@123");

            managerApproval();

            login("qatest@gmail.com", "Pass@123");

            superAdminApproval();
 
            System.out.println("=========================================================");

            System.out.println("✅ EXPENSE MANAGEMENT WORKFLOW- PASSED");

        } catch (Exception e) {

        	System.out.println("❌ EXPENSE MANAGEMENT WORKFLOW- FAILED");

            System.out.println("🔍 Error Message: " + e.getMessage());

            e.printStackTrace();
            Assert.fail("Test failed due to exception: " + e.getMessage());

        }

    }
 
    public void createExpense() throws InterruptedException {

        System.out.println("Super admin login");

        Thread.sleep(2000);

        driver.findElement(By.linkText("Go To Organisation")).click();

        driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();

        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("(//h1[text()='Expense Management'])[1]")).click();

        driver.findElement(By.linkText("Expense Dashboard")).click();

        driver.findElement(By.xpath("//a[text()='Create New']")).click();
 
        // Expense form

        driver.findElement(By.name("reportDetails.reportName")).sendKeys("Food Expense");

        driver.findElement(By.name("reportDetails.reportDate")).sendKeys("12/04/2025");

        Thread.sleep(2000);

        driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).click();

        driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).sendKeys("Other" + Keys.ENTER);

        Thread.sleep(2000);

        driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).click();

        driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).sendKeys("undefined" + Keys.ENTER);

        Thread.sleep(2000);

        driver.findElement(By.name("expenseName")).sendKeys("Food Expense- Mumbai client visit");

        driver.findElement(By.xpath("(//input[@role='combobox'])[4]")).click();

        driver.findElement(By.xpath("(//input[@role='combobox'])[4]")).sendKeys("food" + Keys.ENTER);

        Thread.sleep(2000);

        driver.findElement(By.name("amount")).sendKeys("1247");

        driver.findElement(By.name("dynamicFields.restaurantName")).sendKeys("Nyatti");

        driver.findElement(By.xpath("(//input[@role='combobox'])[5]")).click();

        driver.findElement(By.xpath("(//input[@role='combobox'])[5]")).sendKeys("lunch" + Keys.ENTER);

        WebElement region = driver.findElement(By.name("region"));

        region.click();

        region.sendKeys("Mumbai");

        region.sendKeys(Keys.TAB + "" + Keys.TAB + "Lorem Ipsum is a Dummy text");

        Thread.sleep(1000);

        driver.findElement(By.xpath("//button[text()='Add Expense to Report']")).click();

        driver.findElement(By.xpath("//button[text()='Submit Report']")).click();

        Thread.sleep(2000);

        System.out.println("Expense created and submitted successfully");

        logout();

        System.out.println("Super admin logout");

    }
 
    public void managerApproval() throws InterruptedException {

        System.out.println("Manager login");

        Thread.sleep(2000);

        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();

        Thread.sleep(1000);

        driver.findElement(By.xpath("(//h1[text()='Expense Management'])[1]")).click();

        driver.findElement(By.linkText("Expense Dashboard")).click();

        driver.findElement(By.linkText("View Approvals")).click();

        driver.findElement(By.xpath("(//button[text()='View Details'])[last()]")).click();

        driver.findElement(By.xpath("//button[text()='Expense Items']")).click();

        driver.findElement(By.xpath("//button[text()='Approve']")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("//textarea[@placeholder='Enter reason...']")).click();

        driver.findElement(By.xpath("//textarea[@placeholder='Enter reason...']")).sendKeys("Manager approval");

        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        Thread.sleep(2000);

        System.out.println("First approval done - Manager approval");

        logout();

        System.out.println("Manager logout");

    }
 
    public void superAdminApproval() throws InterruptedException {

        System.out.println("Super admin login");

        Thread.sleep(2000);

        driver.findElement(By.linkText("Go To Organisation")).click();

        driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();

        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("(//h1[text()='Expense Management'])[1]")).click();

        driver.findElement(By.linkText("Expense Dashboard")).click();

        driver.findElement(By.linkText("View Approvals")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("(//button[text()='View Details'])[last()]")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("//button[text()='Expense Items']")).click();

        driver.findElement(By.xpath("//button[text()='Final Approve']")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("//textarea[@placeholder='Enter reason...']")).click();

        driver.findElement(By.xpath("//textarea[@placeholder='Enter reason...']")).sendKeys("Super admin approval");

        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        Thread.sleep(2000);

        System.out.println("Final approval done - Super admin approval");

        logout();

        System.out.println("Super admin logout");

    }
 
    private void login(String email, String password) throws InterruptedException {

        Thread.sleep(2000);

        driver.findElement(By.id("email")).sendKeys(email);

        driver.findElement(By.id("password")).sendKeys(password);

        driver.findElement(By.xpath("//button[text()='Login']")).click();

    }
 
    private void logout() throws InterruptedException {

        Thread.sleep(2000);

        driver.findElement(By.id("basic-button")).click();

        Thread.sleep(2000);

        driver.findElement(By.xpath("//div[text()=' Log out']")).click();

    }
 
    @AfterClass

    public void teardown() throws InterruptedException {

        if (driver != null) {

            Thread.sleep(3000); // Ensure any lingering tasks are completed

            System.out.println("=========================================================");

            driver.quit();

        }

    }

}

 