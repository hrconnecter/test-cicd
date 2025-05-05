package basic;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.Test;

public class BasicSetup {

    @Test
    public void basicSetup() {
        WebDriver driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(15));
        WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(15));

        try {
            // Navigate to the application
            driver.get("https://app.aegishrms.com/sign-in");

            // Login
            driver.findElement(By.name("email")).sendKeys("automationscripts@gmail.com");
            driver.findElement(By.name("password")).sendKeys("Pass@123");
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Login']"))).click();
            System.out.println("Admin Login done successfully");

            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[text()='Go To Organisation']"))).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//button[text()='Setup'])[2]"))).click();

            // Manage roles
            int roleCheckboxCount = 8;
            for (int i = 1; i <= roleCheckboxCount; i++) {
                driver.findElement(By.xpath("(//input[@type='checkbox'])[" + i + "]")).click();
            }
            driver.findElement(By.xpath("//button[text()='Submit']")).click();
            System.out.println("Added Roles successfully");

            // Leaves creation
            addLeave(driver, "Casual leave", "6");
            addLeave(driver, "Sick leave", "4");
            addLeave(driver, "Study leave", "5");
            System.out.println("Added Leaves data successfully");

            // Adding shifts
            addShift(driver, wait, "General Shift", "09:00:AM", "06:00:PM", new String[]{"Mon", "Tue", "Wed", "Thur", "Fri", "Sat"});
            System.out.println("Added Shifts data successfully");

            // Adding location
            addLocation(driver, wait, "asia", "united arab", "dubai", "Dubai", "325412");
            System.out.println("Added Location successfully");

            // Adding public holidays
            addPublicHoliday(driver, wait, "Christmas", "12/25/2025", "optional", "dubai");
            System.out.println("Added Public holidays successfully");

            // Adding employment type
            driver.findElement(By.xpath("//h1[text()='Employment']")).click();
            driver.findElement(By.xpath("//button[text()='Add Employment']")).click();
            driver.findElement(By.name("title")).sendKeys("Full Time");
            driver.findElement(By.xpath("//button[text()='Submit']")).click();
            System.out.println("Added Employment type successfully");

            // Adding Salary Template
            addSalaryTemplate(driver, wait, "Full Time Salary", new String[]{"basic", "hra", "da", "special"}, new String[]{"pf", "esic", "tds", "tax"});
            System.out.println("Added Salary Template successfully");

            // Adding designation
            driver.findElement(By.xpath("//h1[text()='Designation']")).click();
            driver.findElement(By.xpath("//button[text()='Add Designation']")).click();
            driver.findElement(By.name("designationName")).sendKeys("Employee");
            driver.findElement(By.name("designationId")).sendKeys("F-0026");
            driver.findElement(By.xpath("(//button[text()='Add Designation'])[2]")).click();
            System.out.println("Added Designation successfully");

            // Adding Weekly Off
            driver.findElement(By.xpath("//h1[text()='Weekly Off']")).click();
            driver.findElement(By.xpath("//button[text()='Add Days']")).click();
            driver.findElement(By.xpath("(//div[@role='button'])[1]")).click();
            driver.findElement(By.xpath("//button[text()='Submit']")).click();
            System.out.println("Added Weekly off day successfully");

            // Adding PF and ESIC details
            driver.findElement(By.xpath("//h1[text()='PF & ESIC Norms Calculation']")).click();
            driver.findElement(By.name("EPF")).sendKeys("12");
            driver.findElement(By.name("EPS")).sendKeys("12");
            driver.findElement(By.name("ECP")).sendKeys("0.75");
            driver.findElement(By.name("ECS")).sendKeys("3.25");
            driver.findElement(By.xpath("//button[text()='submit']")).click();
            System.out.println("Added PF and ESIC details successfully");

            // Logout
            driver.findElement(By.id("basic-button")).click();
            wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//div[text()=' Log out']"))).click();
            System.out.println("Admin Logout done successfully");

        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            driver.quit();
            System.out.println("Browser closed");
        }
    }

    private void addLeave(WebDriver driver, String leaveName, String count) {
        driver.findElement(By.xpath("//h1[text()='Leaves']")).click();
        driver.findElement(By.xpath("//button[text()='Add Leave']")).click();
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys(leaveName + Keys.ENTER);
        driver.findElement(By.name("count")).sendKeys(count);
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
    }

    private void addShift(WebDriver driver, WebDriverWait wait, String shiftName, String startTime, String endTime, String[] days) {
        driver.findElement(By.xpath("//h1[text()='Shifts']")).click();
        driver.findElement(By.xpath("//button[text()='Add Shift']")).click();
        driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//input[@role='combobox'])[2]"))).sendKeys(Keys.ARROW_DOWN, Keys.ENTER);
        driver.findElement(By.name("shiftName")).sendKeys(shiftName);
        driver.findElement(By.name("startDateTime")).sendKeys(startTime);
        driver.findElement(By.name("endDateTime")).sendKeys(endTime);
        for (String day : days) {
            driver.findElement(By.xpath("//button[text()='" + day + "']")).click();
        }
        driver.findElement(By.xpath("(//button[text()='Add Shift'])[2]")).click();
    }

    private void addLocation(WebDriver driver, WebDriverWait wait, String region, String country, String city, String state, String zipCode) {
        driver.findElement(By.xpath("//h1[text()='Location']")).click();
        driver.findElement(By.xpath("//button[text()='Add Location']")).click();
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys(region + Keys.ENTER);
        driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(country + Keys.ENTER);
        driver.findElement(By.xpath("(//input[@type='text'])[4]")).sendKeys(city + Keys.ENTER + Keys.TAB + state + Keys.TAB + zipCode);
        driver.findElement(By.xpath("(//button[text()='Add Location'])[2]")).click();
    }

    private void addPublicHoliday(WebDriver driver, WebDriverWait wait, String holidayName, String holidayDate, String type, String location) {
        driver.findElement(By.xpath("//h1[text()='Public Holidays']")).click();
        driver.findElement(By.xpath("//button[text()='Add Holiday']")).click();
        driver.findElement(By.name("holidayName")).sendKeys(holidayName);
        driver.findElement(By.name("holidayDate")).sendKeys(holidayDate);
        driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(type + Keys.ENTER);
        driver.findElement(By.xpath("(//input[@role='combobox'])[3]")).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//input[@role='combobox'])[3]"))).sendKeys(location + Keys.ENTER);
        driver.findElement(By.xpath("(//button[text()='Add Holiday'])[2]")).click();
    }

    private void addSalaryTemplate(WebDriver driver, WebDriverWait wait, String templateName, String[] earnings, String[] deductions) {
        driver.findElement(By.xpath("//h1[text()='Salary Template']")).click();
        driver.findElement(By.xpath("//button[text()='Add salary template']")).click();
        driver.findElement(By.name("name")).sendKeys(templateName);
        driver.findElement(By.xpath("(//input[@role='combobox'])[2]")).click();
        wait.until(ExpectedConditions.elementToBeClickable(By.xpath("(//input[@role='combobox'])[2]"))).sendKeys(Keys.ARROW_DOWN, Keys.ENTER);
        for (String earning : earnings) {
            driver.findElement(By.xpath("(//input[@type='text'])[4]")).sendKeys(earning + Keys.ENTER);
        }
        for (String deduction : deductions) {
            driver.findElement(By.xpath("(//input[@type='text'])[5]")).sendKeys(deduction + Keys.ENTER);
        }
        driver.findElement(By.xpath("//button[text()='submit']")).click();
    }
}
