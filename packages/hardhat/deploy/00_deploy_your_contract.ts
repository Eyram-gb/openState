import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

/**
 * Deploys a contract named "OpenStateContract" using the deployer account and
 * constructor arguments set to the manufacturer's name.
 *
 * @param hre HardhatRuntimeEnvironment object.
 */
const deployOpenStateContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();
  const { deploy } = hre.deployments;

  const manufacturer = "Apple Inc."; // Replace with the actual manufacturer's name

  await deploy("OpenState", {
    from: deployer,
    args: [manufacturer], // Updated to pass the manufacturer's name
    log: true,
    autoMine: true,
  });

  const openStateContract = await hre.ethers.getContract<Contract>("OpenState", deployer);
  console.log("'ABC' Hash Test:", await openStateContract.getHash("ABC"));
};

export default deployOpenStateContract;

deployOpenStateContract.tags = ["OpenState"];
