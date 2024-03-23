{
  inputs.flake-utils.url = "github:numtide/flake-utils";
  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixpkgs-unstable";

  outputs = {
    nixpkgs,
    flake-utils,
    self,
  }: let
    inherit
      (builtins)
      tryEval
      ;

    inherit
      (nixpkgs.lib)
      attrValues
      concatStringsSep
      filterAttrs
      getExe
      hasPrefix
      isDerivation
      ;

    inherit
      (flake-utils.lib)
      eachDefaultSystem
      mkApp
      ;

    systemAgnosticOutputs = eachDefaultSystem (system: let
      pkgs = nixpkgs.legacyPackages.${system};

      inherit
        (pkgs)
        writeShellScript
        parallel
        ;

      allRuntimes = attrValues (filterAttrs (name: pkg: hasPrefix "nodejs_" name && isDerivation (tryEval pkg).value) pkgs);

      testWithRuntime = runtime:
        writeShellScript "test-with-nodejs_${runtime.version}" (
          let
            npm = "${runtime}/bin/npm";
          in ''
            ${npm} install
            ${npm} test
          ''
        );

      allTests = map testWithRuntime allRuntimes;

      test = writeShellScript "test" ''
        log=log

        ${getExe parallel} --keep-order --will-cite --joblog $log ::: ${concatStringsSep " " allTests}
        cat $log
        if grep -q 'Exitval [^0]' $log; then
            echo "Some scripts failed."
            exit 1
        fi
      '';
    in {
      devShells.default = pkgs.mkShell {packages = [pkgs.nodejs];};

      apps.test = mkApp {
        drv = test;
        exePath = "";
      };
    });
  in
    systemAgnosticOutputs;
}
