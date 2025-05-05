package basic;

import java.time.Duration;

import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;
import org.testng.annotations.Test;

public class CreateOrgSetup {

    private WebDriver driver;
    @BeforeClass
    public void setup() {
        driver = new ChromeDriver();
        driver.manage().window().maximize();
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(20));
        new WebDriverWait(driver, Duration.ofSeconds(20));
        System.out.println("=========================================================");
        System.out.println("CREATE ORGANIZATION AND SETUP");
    }

    @Test
    public void manageOrganization() throws InterruptedException {
        login();
        createOrganization();
        setupOrganization();
        deleteOrganization();
        logout();
    }

    private void login() throws InterruptedException {
        driver.get("https://app.aegishrms.com/sign-in");

        driver.findElement(By.name("email")).sendKeys("automationscripts@gmail.com");
        driver.findElement(By.name("password")).sendKeys("Pass@123");
        driver.findElement(By.xpath("//button[text()='Login']")).click();
        Thread.sleep(2000);

        System.out.println("Login successful");
    }

    private void createOrganization() throws InterruptedException {
        driver.findElement(By.linkText("Go To Organisation")).click();
        Thread.sleep(2000);

        driver.findElement(By.xpath("//button[text()='Add Organisation']")).click();
        driver.findElement(By.name("orgName")).sendKeys("Burberry 1");
        driver.findElement(By.name("foundation_date")).sendKeys("05/25/1967");
        selectIndustry("retail");
        driver.findElement(By.name("email")).sendKeys("burberry1@gmail.com");
        driver.findElement(By.name("contact_number")).sendKeys("9278525273");
        enterLocation("london");
        driver.findElement(By.xpath("//label[text()='Do you want 7 day Trial']")).click();
        Thread.sleep(2000);

        driver.findElement(By.xpath("(//button[@type='submit'])[1]")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("(//button[text()='Get Started'])[2]")).click();

        driver.findElement(By.name("count")).sendKeys("20");
        driver.findElement(By.name("cycleCount")).sendKeys(Keys.BACK_SPACE + "1");
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys("razorpay" + Keys.ENTER);
        driver.findElement(By.xpath("//button[text()='Confirm & Pay']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//button[text()='Submit']")).click();

        System.out.println("Organization created successfully");
    }

    private void setupOrganization() throws InterruptedException {
    	
    	driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Home']")).click();
        driver.findElement(By.linkText("Dashboard")).click();
        driver.navigate().refresh();
        Thread.sleep(3000);
        driver.findElement(By.xpath("//input[@placeholder='Search Organisation']")).sendKeys("Burberry 1" + Keys.ENTER);
        driver.findElement(By.xpath("//button[text()='Setup']")).click();
    	
        // Add roles
        int roleCheckboxCount = 8;
        for (int i = 1; i <= roleCheckboxCount; i++) {
            driver.findElement(By.xpath("(//input[@type='checkbox'])[" + i + "]")).click();
        }
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
        System.out.println("Added Roles successfully");

        // Leaves creation
        addLeave("Casual leave", "6");
        addLeave("Sick leave", "4");
        addLeave("Study leave", "5");
        System.out.println("Added Leaves data successfully");

        // Adding shifts
        addShift("office","General Shift", "09:00:AM", "06:00:PM", new String[]{"Mon", "Tue", "Wed", "Thur", "Fri", "Sat"});
        System.out.println("Added Shifts data successfully");

        // Adding location
        addLocation(driver, "asia", "united arab", "dubai", "Dubai", "325412", "Abu dhabi", "UAE");
        System.out.println("Added Location successfully");

        // Adding employment type
        driver.findElement(By.xpath("//h1[text()='Employment']")).click();
        driver.findElement(By.xpath("//button[text()='Add Employment']")).click();
        driver.findElement(By.name("title")).sendKeys("Full Time");
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
        System.out.println("Added Employment type successfully");
        
        //Adding salary template
        addsalarytemplate("Full Time Salary", "Full");
        System.out.println("Added Salary Template successfully");
        
        //Pf  and esic calculation
        driver.findElement(By.xpath("//h1[text()='PF & ESIC Norms Calculation']")).click();
        driver.findElement(By.name("EPF")).sendKeys("12");
        driver.findElement(By.name("EPS")).sendKeys("12");
        driver.findElement(By.name("ECP")).sendKeys("0.75");
        driver.findElement(By.name("ECS")).sendKeys("3.25");
        driver.findElement(By.xpath("//button[text()='submit']")).click();
        System.out.println("PF and ESIC setup added successfully");
        
    }

    private void deleteOrganization() throws InterruptedException {
        Thread.sleep(5000);
        driver.findElement(By.xpath("//button[@aria-label='open drawer']")).click();
        Thread.sleep(2000);
        driver.findElement(By.xpath("//h1[text()='Home']")).click();
        driver.findElement(By.linkText("Dashboard")).click();
        Thread.sleep(3000);
        driver.findElement(By.xpath("//input[@placeholder='Search Organisation']")).sendKeys("Burberry 1" + Keys.ENTER);
        driver.findElement(By.xpath("(//*[local-name()='svg' and @data-testid='MoreVertIcon'])")).click();
        driver.findElement(By.xpath("//li[text()='Delete']")).click();
        driver.findElement(By.xpath("//button[text()='Delete']")).click();
        Thread.sleep(3000);

        System.out.println("Organization deleted successfully");
    }

    private void logout() throws InterruptedException {
        driver.findElement(By.id("basic-button")).click();
        driver.findElement(By.xpath("//div[text()=' Log out']")).click();
        Thread.sleep(2000);

        System.out.println("Logout successful");
    }

    private void addLeave(String leaveName, String count) {
        driver.findElement(By.xpath("//h1[text()='Leaves']")).click();
        driver.findElement(By.xpath("//button[text()='Add Leave']")).click();
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys(leaveName + Keys.ENTER);
        driver.findElement(By.name("count")).sendKeys(count);
        driver.findElement(By.xpath("//button[text()='Submit']")).click();
    }

    private void addShift(String shiftType, String shiftName, String startTime, String endTime, String[] days) throws InterruptedException {
        driver.findElement(By.xpath("//h1[text()='Shifts']")).click();
        driver.findElement(By.xpath("//button[text()='Add Shift']")).click();
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys(shiftType +Keys.ENTER);
        driver.findElement(By.name("shiftName")).sendKeys(shiftName);
        driver.findElement(By.name("startDateTime")).sendKeys(startTime);
        driver.findElement(By.name("endDateTime")).sendKeys(endTime);
        for (String day : days) {
            driver.findElement(By.xpath("//button[text()='" + day + "']")).click();
        }
        driver.findElement(By.xpath("(//button[text()='Add Shift'])[2]")).click();
    }

    private void addLocation(WebDriver driver, String continent, String country, String city, String state, String zipCode, String shortName, String address) {
    	driver.findElement(By.xpath("//h1[text()='Location']")).click();
        driver.findElement(By.xpath("//button[text()='Add Location']")).click();
        driver.findElement(By.xpath("(//input[@type='text'])[2]")).sendKeys(continent + Keys.ENTER);
        driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(country + Keys.ENTER);
        driver.findElement(By.xpath("(//input[@type='text'])[4]")).sendKeys(state + Keys.ENTER + Keys.TAB + city + Keys.ENTER );
        driver.findElement(By.name("shortName")).sendKeys(shortName);
        driver.findElement(By.name("pinCode")).sendKeys(zipCode);
        driver.findElement(By.name("addressLine1")).sendKeys(address);
        driver.findElement(By.xpath("(//button[text()='Add Location'])[2]")).click();
    }
    
    public void addsalarytemplate(String templateName, String emptype) {
    	driver.findElement(By.xpath("//h1[text()='Salary Template']")).click();
        driver.findElement(By.xpath("//button[text()='Add salary template']")).click();
        driver.findElement(By.name("name")).sendKeys(templateName);
        driver.findElement(By.xpath("(//input[@type='text'])[3]")).sendKeys(emptype + Keys.ENTER);
        WebElement incomecomponent = driver.findElement(By.xpath("(//input[@type='text'])[4]"));
        incomecomponent.sendKeys("Basic" + Keys.ENTER + "Hra" + Keys.ENTER + "Da" + Keys.ENTER +"Special" + Keys.ENTER);
        WebElement deductioncomponent = driver.findElement(By.xpath("(//input[@type='text'])[5]"));
        deductioncomponent.sendKeys("Pf" + Keys.ENTER + "Esic" + Keys.ENTER + "Tds" + Keys.ENTER +"tax" + Keys.ENTER);
        driver.findElement(By.xpath("//button[text()='submit']")).click();
    }


    private void selectIndustry(String industry) {
        WebElement industryInput = driver.findElement(By.id("react-select-3-input"));
        industryInput.click();
        industryInput.sendKeys(industry + Keys.ENTER);
    }

    private void enterLocation(String location) throws InterruptedException {
        WebElement locationInput = driver.findElement(By.xpath("(//input[@type='text'])[4]"));
        locationInput.sendKeys(location);
        Thread.sleep(2000);
        locationInput.sendKeys(Keys.ENTER);
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
