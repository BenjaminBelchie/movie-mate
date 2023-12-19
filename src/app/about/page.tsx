import { Avatar, Button, Divider } from "@nextui-org/react";
import ProductDescription from "../_components/About/product-description";
import { CoffeeIcon } from "../_components/Icons/CoffeeIcon";

export default function AboutPage() {
  return (
    <div className="flex justify-center">
      <div className="my-4 flex w-full max-w-[1350px] flex-col gap-8 px-6 md:px-0">
        <div>
          <p className="text-3xl font-bold md:text-4xl">What is Movie Mate?</p>
          <Divider className="my-2" />
          <ProductDescription />
        </div>
        <div>
          <p className="text-3xl font-bold md:text-4xl">Who made Movie Mate?</p>
          <Divider className="my-2" />
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-4">
              <Avatar src="/ben.jpg" className="h-32 w-32 md:h-44 md:w-44" />
              <div className="flex flex-col gap-2">
                <p className="pl-1 text-3xl font-bold">Ben Belcher</p>
                <p className="pl-1">@BenjaminBelchie</p>
                <a
                  href="https://www.buymeacoffee.com/benbelcher"
                  target="_blank"
                >
                  <Button variant="flat" color="warning">
                    <CoffeeIcon /> Buy me a coffee
                  </Button>
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-2xl font-bold">Why did I make Movie Mate?</p>
              <p className="text-gray-300">
                I developed Movie Mate initially to make my life easier. Typical
                for a developer to spend hours making a complex solution to a
                simple problem but here we are 😃. I wanted to make an easy way
                to track all the movie recommendations I receive from friends
                and family, plus I did not want to manually add each one. I also
                wanted an easy way to find out where you could watch the movies,
                with the many streaming services we have its difficult to know
                where to look. Movie Mate solves both of these problems for me
                and hopefully for you too!
              </p>
              <p className="text-gray-300">
                If you enjoy using Movie Mate I'd really appreciate if you
                bought me a coffee ☕. Movie Mate does not collect any personal
                data, collect or send analytics or run ads and I am committed to
                keeping it that way. If you do want to support me you can use
                the link above 😃
              </p>
            </div>
          </div>
        </div>
        <div>
          <p className="text-3xl font-bold md:text-4xl">Support</p>
          <Divider className="my-2" />
          <p>
            If you experience any issues or find bugs then please raise a new
            Issue in{" "}
            <a
              href="https://github.com/BenjaminBelchie/movie-mate/issues"
              target="_blank"
              className="text-blue-500 underline"
            >
              GitHub
            </a>{" "}
            and I'll try and fix the issue as soon as possible.
          </p>
        </div>
      </div>
    </div>
  );
}
