import Register from "@/components/Register";
import Layout from "../components/Layout";
import Template from "../components/Template";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import LogIn from "@/components/LogIn";
import useAuth from "@/hooks/useAuth";

export default function LogInAndRegisterLayout() {
  const { user, loading } = useAuth();

  return (
    <Layout className="min-h-screen flex items-center justify-center">
      <Template>
        <div className="flex tablet-lg:flex-col">
          <div className="basis-1/2 text-center p-5">
            <h1>
              {loading
                ? "Loading"
                : user?.user
                ? `${user.user.firstName} ${user.user.lastName}`
                : ""}
            </h1>

            <h2 className="text-[2.075rem] font-semibold tracking-tight text-gray-900 dark:text-white">
              Welcome to DHL
            </h2>

            <h5 className="text-[1.175rem] font-medium text-gray-900 dark:text-gray-100 mt-1">
              25 years of delivering packages
            </h5>

            <img
              className="w-5/10 mx-auto"
              src="/loginregister.png"
              alt="Login Register Image"/>
          </div>

          <div className="basis-1/2 flex h-full items-center justify-center">
            <div
              className="
                bg-card dark:bg-dark-card
                rounded-lg shadow-lg
                w-full m-10 overflow-hidden
                border-2 border-black dark:border-white">
              <Tabs defaultValue="login" className="w-full">
                <TabsList
                  className="
                    !w-full !p-0 !m-0 rounded-none
                    flex items-stretch h-10
                    bg-card/50 dark:bg-dark-card/50">
                  <TabsTrigger
                    value="login"
                    className="
                      flex-1 h-full rounded-none
                      text-gray-900 dark:text-gray-100
                      border-none shadow-none
                      relative
                      after:content-['']
                      after:absolute after:left-0 after:right-0 after:bottom-0
                      after:h-[2px]
                      after:bg-black dark:after:bg-white
                      data-[state=active]:bg-secondary
                      data-[state=active]:text-white">
                    Log In
                  </TabsTrigger>

                  <div className="w-[2px] h-full bg-black dark:bg-white"/>

                  <TabsTrigger
                    value="register"
                    className="
                      flex-1 h-full rounded-none
                      text-gray-900 dark:text-gray-100
                      border-none shadow-none
                      relative
                      after:content-['']
                      after:absolute after:left-0 after:right-0 after:bottom-0
                      after:h-[2px]
                      after:bg-black dark:after:bg-white
                      data-[state=active]:bg-secondary
                      data-[state=active]:text-white">
                    Register
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <LogIn/>
                </TabsContent>

                <TabsContent value="register">
                  <Register/>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </Template>
    </Layout>
  );
}