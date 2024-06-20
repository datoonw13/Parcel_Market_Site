import Avatar from "@/components/@new/shared/Avatar";
import Popper from "@/components/@new/shared/Popper";
import AutoComplete from "@/components/@new/shared/forms/AutoComplete";
import Button from "@/components/@new/shared/forms/Button";
import TextField from "@/components/@new/shared/forms/TextField";

export default function PlaygroundPage() {
  return (
    <main className="space-y-8 mb-44 max-w-6xl m-auto">
      <h1 className="text-4xl mt-8">Playground</h1>

      <div>
        <h2 className="mb-4 text-lg font-mono">Popper</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <Popper anchorPlacement="bottom end" renderButton={<div className="font-semibold">Click here</div>}>
            <div className="shadow-lg p-4 bg-primary-main-600 rounded-lg">Popper Content</div>
          </Popper>
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">Avatar</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <Avatar title="LA" />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">TextField</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <TextField endIcon={<p className="">qdwd</p>} label="Primary" />
          <TextField variant="secondary" label="secondary" />
          <TextField variant="primary" placeholder="placeholder" />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">AutoComplete</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <AutoComplete />
        </div>
      </div>
      <div>
        <h2 className="mb-4 text-lg font-mono">Button</h2>
        <hr className="mb-4 border-gray-200 dark:border-gray-800" />
        <div className="flex space-x-8">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
        </div>
      </div>
    </main>
  );
}
