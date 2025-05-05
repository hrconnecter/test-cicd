package essential;

import java.time.Duration;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class EmployeeOnboarding {

    private WebDriver driver;

    @BeforeClass
    public void setup() {
        driver = BaseDriverSetup.getDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        driver.get("https://app.aegishrms.com");
        System.out.println("=========================================================");
        System.out.println("▶️ EMPLOYEE ONBOARDING");
    }

    @Test
    public void employeeOnboardingWorkflow() throws InterruptedException {
    	try {
        login();
        navigateToOnboardingPage();
        fillFirstPageDetails();
        fillSecondPageDetails();
        completeThirdPage();
        submitAndDeleteEmployee();
        logout();
        
        System.out.println("=========================================================");
        System.out.println("✅ EMPLOYEE ONBOARDING- PASSED");
    } catch (Exception e) {
    	System.out.println("❌ EMPLOYEE ONBOARDING- FAILED");
        System.out.println("🔍 Error Message: " + e.getMessage());
        e.printStackTrace();

    }
    }

    private void login() throws InterruptedException {
        driver.findElement(By.name("email")).sendKeys("automationscripts@gmail.com");
        driver.findElement(By.name("password")).sendKeys("Pass@123");
        driver.findElement(By.xpath("//button[text()='Login']")).click();
        System.out.println("Admin Login done successfully");
    }

    private void navigateToOnboardingPage() throws InterruptedException {
        driver.findElement(By.linkText("Go To Organisation")).click();
        driver.findElement(By.xpath("(//button[text()='Setup'])[1]")).click();
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Employee']")).click();
        driver.findElement(By.linkText("Onboarding")).click();
    }

    private void fillFirstPageDetails() throws InterruptedException {
        // Employee basic details
        driver.findElement(By.name("first_name")).sendKeys("Manager");
        driver.findElement(By.name("last_name")).sendKeys("User");
        driver.findElement(By.name("date_of_birth")).sendKeys("06/25/2000");
        driver.findElement(By.name("email")).sendKeys("manager@raulflauren.com");
        driver.findElement(By.name("phone_number")).sendKeys("9568471758");
        driver.findElement(By.name("address")).sendKeys("London, UK");
        driver.findElement(By.xpath("//input[@value='male']")).click();
        driver.findElement(By.name("adhar_card_number")).sendKeys("458796325412");
        driver.findElement(By.name("pan_card_number")).sendKeys("NYSWG1426D");
        driver.findElement(By.name("bank_account_no")).sendKeys("827273");
        driver.findElement(By.name("citizenship")).sendKeys("UnitedKingdom");
        driver.findElement(By.xpath("//button[text()='Next']")).click();
        Thread.sleep(3000);
        System.out.println("First page completed");
    }

    private void fillSecondPageDetails() throws InterruptedException {
        // Employee additional details
        driver.findElement(By.name("empId")).sendKeys("RL-0081");
        driver.findElement(By.name("companyemail")).sendKeys("raulflauren@gmail.com");
        driver.findElement(By.name("joining_date")).sendKeys("10/12/2023");
        selectDropdown("(//input[@role='combobox'])[2]", "sales");
        driver.findElement(By.name("password")).sendKeys("Pass@123");
        driver.findElement(By.name("confirmPassword")).sendKeys("Pass@123");
        selectDropdown("(//input[@role='combobox'])[4]", "manager");
        selectDropdown("(//input[@role='combobox'])[5]", "001");
        selectDropdown("(//input[@role='combobox'])[6]", "employee");
        selectDropdown("(//input[@role='combobox'])[8]", "lake");
        selectDropdown("(//input[@role='combobox'])[9]", "full");
        selectDropdown("(//input[@role='combobox'])[10]", "full");
        driver.findElement(By.xpath("//button[text()='Next']")).click();
        Thread.sleep(3000);
        System.out.println("Second page completed");
    }

    private void completeThirdPage() throws InterruptedException {
        driver.findElement(By.xpath("//button[text()='Next']")).click();
        Thread.sleep(3000);
        System.out.println("Third page completed");
    }

    private void submitAndDeleteEmployee() throws InterruptedException {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript("window.scrollTo(0, document.body.scrollHeight)");
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
        Thread.sleep(5000);
        System.out.println("Employee Onboarding done successfully");

        //Delete Employee
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
//        driver.findElement(By.xpath("//h1[text()='Employee']")).click();
        driver.findElement(By.linkText("Offboarding")).click();
        
        driver.findElement(By.xpath("//input[@placeholder='Search Employee']")).sendKeys("Manager" + Keys.ENTER);
        Thread.sleep(2000);
        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='DeleteOutlineIcon']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("(//button[text()='Delete'])[2]")).click();
	    Thread.sleep(3000);
	    System.out.println("Employee deleted successfully");
        
//        // Delete Employee
//        driver.findElement(By.xpath("//input[@placeholder='Search Employee']")).sendKeys("Manager" + Keys.ENTER);
//        Thread.sleep(2000);
//        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='EditOutlinedIcon']")).click();
//        driver.findElement(By.xpath("//button[text()='Next']")).click();
//        driver.findElement(By.xpath("//button[text()='Next']")).click();
//        driver.findElement(By.xpath("//button[text()='Next']")).click();
//        driver.findElement(By.xpath("//button[text()='Submit']")).click();
//        System.out.println("Edit employee done successfully");
//        
//        driver.findElement(By.xpath("//*[local-name()='svg' and @data-testid='PersonOffIcon']")).click();
//        Thread.sleep(2000);
//        driver.findElement(By.xpath("//button[text()='Confirm']")).click();
//        Thread.sleep(3000);
//        System.out.println("Employee deleted successfully");
    }

    private void logout() throws InterruptedException {
    	
        driver.findElement(By.id("basic-button")).click();
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
        System.out.println("Admin Logout done successfully");
    }

    private void selectDropdown(String xpath, String value) throws InterruptedException {
        WebElement dropdown = driver.findElement(By.xpath(xpath));
        dropdown.click();
        Thread.sleep(2000);
        dropdown.sendKeys(value + Keys.ARROW_DOWN);
        Thread.sleep(2000);
        dropdown.sendKeys(Keys.ENTER);
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
